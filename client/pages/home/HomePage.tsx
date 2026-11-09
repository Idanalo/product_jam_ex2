import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import styles from "./HomePage.module.css";

type Me = { id: string; email: string };

export default function HomePage() {
  const { user } = useAuth();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => api<Me>("/api/me"),
    enabled: Boolean(user),
  });

  return (
    <main className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.title}>Product Jam Web Application</h1>
        <p className={styles.subtitle}>
          A full-stack web application built with React, Cloudflare Workers,
          Supabase, and Google Gemini AI for Exercise 2.
        </p>

        <div className={styles.logos}>
          <img src="/huji.svg" alt="HUJI Logo" width="70" height="70" />
          <img src="/bezalel.svg" alt="Bezalel Logo" width="70" height="70" />
        </div>
      </header>

      {user ? (
        <section className={styles.userBanner}>
          <p>
            Logged in as:{" "}
            <strong>
              {meQuery.isPending
                ? "Verifying session with server..."
                : meQuery.isError
                  ? user.email
                  : meQuery.data.email}
            </strong>
          </p>
          <p>
            <Link to="/events">View Sample Events &rarr;</Link>
          </p>
        </section>
      ) : null}

      <section className={styles.grid}>
        {/* Part 1: Tic-tac-toe */}
        <article className={styles.card}>
          <div>
            <div className={styles.cardHeader}>
              <span className={styles.cardTag}>Part 1</span>
            </div>
            <h2 className={styles.cardTitle}>Tic-tac-toe</h2>
            <p className={styles.cardDescription}>
              Play the 4×4 Big-Three tic-tac-toe variant (three-in-a-row wins).
              Moves are strictly replayed and verified server-side with zero trust.
            </p>
            <ul className={styles.cardFeatures}>
              <li>Custom 4×4 board with pure rule evaluation</li>
              <li>Server-side move replay & cheat prevention</li>
              <li>Personal game match history with visual board snapshots</li>
            </ul>
          </div>
          <Link to="/tic-tac-toe" className={styles.cardButton}>
            Play Tic-tac-toe &rarr;
          </Link>
        </article>

        {/* Part 2: Space Pictures */}
        <article className={styles.card}>
          <div>
            <div className={styles.cardHeader}>
              <span className={styles.cardTag}>Part 2</span>
            </div>
            <h2 className={styles.cardTitle}>Space Pictures</h2>
            <p className={styles.cardDescription}>
              Browse NASA Astronomy Picture of the Day (APOD) photos with
              AI-generated Hebrew summaries for 10-year-olds and thematic tags.
            </p>
            <ul className={styles.cardFeatures}>
              <li>NASA APOD API integration via secure Cloudflare backend</li>
              <li>Google Gemini AI Hebrew explanations with structured JSON</li>
              <li>Supabase global database caching to avoid duplicate queries</li>
            </ul>
          </div>
          <Link to="/nasa" className={styles.cardButton}>
            Explore Space Pictures &rarr;
          </Link>
        </article>

        {/* Part 3: Design to Code */}
        <article className={styles.card}>
          <div>
            <div className={styles.cardHeader}>
              <span className={styles.cardTag}>Part 3</span>
            </div>
            <h2 className={styles.cardTitle}>Design to Code</h2>
            <p className={styles.cardDescription}>
              Mobile-first responsive webpage implemented in collaboration with a
              designer partner from Figma into production code.
            </p>
            <ul className={styles.cardFeatures}>
              <li>Built directly from Figma design specifications</li>
              <li>Responsive across mobile, tablet, and desktop</li>
              <li>Publicly accessible without login for rapid design review</li>
            </ul>
          </div>
          <Link to="/design" className={styles.cardButton}>
            View Design &rarr;
          </Link>
        </article>
      </section>
    </main>
  );
}
