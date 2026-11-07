import {
  ALLOWED_TAGS,
  explainApodInputSchema,
  hebrewExplanationSchema,
} from "@shared/schemas/nasa";
import { Hono } from "hono";
import type { AppEnv } from "../env";
import { fail, validate } from "../lib/errors";
import { createAdminClient } from "../lib/supabase";

function cleanNasaText(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/^Explanation:\s*/i, "")
    .replace(/Tomorrow's picture:.*$/i, "")
    .trim();
}

export const nasa = new Hono<AppEnv>()
  // GET /api/nasa/pictures - fetch random space pictures from APOD
  .get("/pictures", async (c) => {
    const countParam = Number(c.req.query("count")) || 9;
    const count = Math.min(Math.max(1, countParam), 20);

    let rawPictures: Array<{
      date: string;
      title: string;
      explanation: string;
      url: string;
      hdurl?: string;
      media_type: string;
    }>;

    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${c.env.NASA_API_KEY}&count=${count}`,
      );

      if (!response.ok) {
        console.error("NASA API returned error status:", response.status);
        return fail(
          c,
          502,
          "nasa_api_error",
          "Could not load space pictures from NASA. Please try again later.",
        );
      }

      rawPictures = await response.json();
      if (!Array.isArray(rawPictures)) {
        return fail(
          c,
          502,
          "nasa_api_error",
          "Invalid response received from NASA.",
        );
      }

      // NASA's website migration broke the legacy APOD scraper, causing it to return
      // "NASA Science" with the header logo (nasa-logo@2x.png). If detected, fetch
      // authentic APOD entries from NASA's official science.nasa.gov endpoint.
      const hasScraperBug = rawPictures.every(
        (p) => p.url?.includes("nasa-logo") || p.title === "NASA Science",
      );

      if (hasScraperBug) {
        try {
          const randomPage = Math.floor(Math.random() * 25) + 1;
          const basicRes = await fetch(
            `https://science.nasa.gov/wp-json/wp/v2/apod-basic?per_page=${count}&page=${randomPage}`,
          );
          if (basicRes.ok) {
            const basicItems = (await basicRes.json()) as Array<{
              date: string;
              title: string;
              explanation: string;
              url: string;
              hdurl?: string;
              media_type?: string;
            }>;
            if (Array.isArray(basicItems) && basicItems.length > 0) {
              rawPictures = basicItems.map((item) => ({
                date: item.date,
                title: item.title,
                explanation: cleanNasaText(item.explanation || ""),
                url: item.hdurl || item.url,
                hdurl: item.hdurl,
                media_type: item.media_type || "image",
              }));
            }
          }
        } catch (fallbackErr) {
          console.warn("NASA basic endpoint fallback failed:", fallbackErr);
        }
      }
    } catch (err) {
      console.error("Failed to fetch from NASA:", err);
      return fail(
        c,
        502,
        "nasa_api_error",
        "Could not connect to NASA API. Please try again later.",
      );
    }

    // Attach existing cached translations from Supabase
    const supabase = createAdminClient(c.env);
    const dates = rawPictures.map((p) => p.date).filter(Boolean);

    let translationsMap = new Map<string, unknown>();
    if (dates.length > 0) {
      const { data: cached } = await supabase
        .from("apod_translations")
        .select("*")
        .in("date", dates);

      if (cached) {
        translationsMap = new Map(cached.map((item) => [item.date, item]));
      }
    }

    const pictures = rawPictures.map((pic) => ({
      ...pic,
      translation: translationsMap.get(pic.date) ?? null,
    }));

    return c.json(pictures);
  })

  // POST /api/nasa/explain - retrieve or generate Hebrew explanation with Gemini
  .post("/explain", validate("json", explainApodInputSchema), async (c) => {
    const { date } = c.req.valid("json");
    const supabase = createAdminClient(c.env);

    // 1. Check database cache first ("Never pay twice for the same answer")
    const { data: cached } = await supabase
      .from("apod_translations")
      .select("*")
      .eq("date", date)
      .maybeSingle();

    if (cached) {
      return c.json(cached);
    }

    // 2. Fetch canonical picture metadata from NASA directly
    // The server never trusts the browser with the original text!
    let nasaData: { title: string; explanation: string };
    try {
      const nasaRes = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${c.env.NASA_API_KEY}&date=${date}`,
      );

      if (!nasaRes.ok) {
        console.error("NASA date fetch failed:", nasaRes.status);
        return fail(
          c,
          502,
          "nasa_api_error",
          "Failed to retrieve picture details from NASA.",
        );
      }

      nasaData = await nasaRes.json();

      // If legacy API returned generic "NASA Science" title/explanation due to the scraper bug,
      // fetch authentic canonical details from NASA's official endpoint using the date
      if (
        nasaData.title === "NASA Science" ||
        nasaData.title.trim().length === 0
      ) {
        try {
          const yymmdd = date.replace(/-/g, "").slice(2);
          const dateRes = await fetch(
            `https://science.nasa.gov/wp-json/wp/v2/apod-basic/${yymmdd}`,
          );
          if (dateRes.ok) {
            const dateItem = (await dateRes.json()) as {
              title?: string;
              explanation?: string;
            };
            if (dateItem?.title) {
              nasaData = {
                title: dateItem.title,
                explanation: cleanNasaText(dateItem.explanation || ""),
              };
            }
          }
        } catch (dateFallbackErr) {
          console.warn("NASA date fallback failed:", dateFallbackErr);
        }
      }
    } catch (err) {
      console.error("NASA connection error:", err);
      return fail(
        c,
        502,
        "nasa_api_error",
        "Could not reach NASA to verify picture details.",
      );
    }

    // 3. Ask Gemini to explain in Hebrew and generate tags using structured output
    let geminiText: string;
    try {
      const prompt = `You are an astronomy educator. Read this NASA Astronomy Picture of the Day:\n\nTitle: ${nasaData.title}\nExplanation: ${nasaData.explanation}\n\nTasks:\n1. hebrew_title: An engaging Hebrew translation of the title.\n2. hebrew_summary: A 2-3 sentence explanation in simple, clear Hebrew suitable for a 10-year-old child.\n3. tags: Choose 1 to 5 tags strictly from this allowed list: [${ALLOWED_TAGS.join(", ")}].`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${c.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  hebrew_title: { type: "STRING" },
                  hebrew_summary: { type: "STRING" },
                  tags: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                  },
                },
                required: ["hebrew_title", "hebrew_summary", "tags"],
              },
            },
          }),
        },
      );

      if (!geminiRes.ok) {
        const errorBody = await geminiRes.text();
        console.error("Gemini API error:", geminiRes.status, errorBody);
        return fail(
          c,
          502,
          "llm_error",
          "Gemini AI was unable to generate an explanation.",
        );
      }

      const geminiJson = (await geminiRes.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      geminiText = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    } catch (err) {
      console.error("Gemini request failed:", err);
      return fail(
        c,
        502,
        "llm_error",
        "Failed to communicate with the Gemini AI service.",
      );
    }

    // 4. Validate output with Zod schema (LLMs don't always do what they're told)
    let parsed: unknown;
    try {
      parsed = JSON.parse(geminiText);
    } catch {
      return fail(
        c,
        502,
        "llm_error",
        "The AI returned an invalid JSON response.",
      );
    }

    const validation = hebrewExplanationSchema.safeParse(parsed);
    if (!validation.success) {
      console.error("Schema validation failed:", validation.error);
      return fail(
        c,
        502,
        "llm_error",
        "The AI explanation did not meet the required format.",
      );
    }

    // Sanitize tags against the allowed vocabulary
    const allowedLower = ALLOWED_TAGS.map((t) => t.toLowerCase());
    const validTags = validation.data.tags
      .map((t) => t.toLowerCase().trim())
      .filter((t) => allowedLower.includes(t));

    const finalTags =
      validTags.length > 0 ? validTags.slice(0, 5) : ["deep-space"];

    // 5. Save the result in the database cache
    const { data: saved, error } = await supabase
      .from("apod_translations")
      .insert({
        date,
        original_title: nasaData.title,
        original_explanation: nasaData.explanation,
        hebrew_title: validation.data.hebrew_title,
        hebrew_summary: validation.data.hebrew_summary,
        tags: finalTags,
      })
      .select()
      .single();

    if (error) {
      console.error("Database save translation failed:", error);
      return fail(c, 500, "database_error", "Could not cache the explanation.");
    }

    return c.json(saved);
  });
