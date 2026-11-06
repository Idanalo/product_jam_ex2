import { GameRuleError, replayGame } from "@shared/game";
import { createGameSchema } from "@shared/schemas/games";
import { Hono } from "hono";
import type { AppEnv } from "../env";
import { fail, validate } from "../lib/errors";
import { createAdminClient } from "../lib/supabase";

const COLUMNS = "id, owner_id, moves, result, created_at";

export const games = new Hono<AppEnv>()
  // GET /api/games - list saved games for the current user, newest first
  .get("/", async (c) => {
    const supabase = createAdminClient(c.env);
    const { data, error } = await supabase
      .from("games")
      .select(COLUMNS)
      .eq("owner_id", c.get("user").id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("list games failed:", error);
      return fail(c, 500, "database_error", "Could not load saved games.");
    }

    return c.json(data);
  })

  // POST /api/games - save a completed game. Replays and verifies every move.
  .post("/", validate("json", createGameSchema), async (c) => {
    const { moves } = c.req.valid("json");

    // Replay moves using the pure engine shared with the browser.
    // The server never trusts the browser: it re-computes the winner.
    let outcome: ReturnType<typeof replayGame>;
    try {
      outcome = replayGame(moves);
    } catch (err) {
      const message =
        err instanceof GameRuleError
          ? err.message
          : "The submitted move sequence is not a valid game.";
      return fail(c, 400, "invalid_game", message);
    }

    const supabase = createAdminClient(c.env);
    const { data, error } = await supabase
      .from("games")
      .insert({
        owner_id: c.get("user").id,
        moves,
        result: outcome.result,
      })
      .select(COLUMNS)
      .single();

    if (error) {
      console.error("save game failed:", error);
      return fail(c, 500, "database_error", "Could not save the game.");
    }

    return c.json(data, 201);
  });
