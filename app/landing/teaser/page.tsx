import type { Metadata } from "next";
import Link from "next/link";
import styles from "../landing.module.css";
import { teaserBeats } from "../landing-content";

export const metadata: Metadata = {
  title: "Teaser Demo | AI Trivia Showdown",
  description:
    "A curated teaser page for AI Trivia Showdown that maps out the best two-to-three minute launch demo.",
};

export default function TeaserPage() {
  return (
    <main className={styles.contentStack}>
      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Teaser Demo</p>
          <h1 className={styles.pageTitle}>A trailer, not the full movie.</h1>
          <p className={styles.pageIntro}>
            The goal of this page is to showcase the sharpest highlights of AI
            Trivia Showdown in a short, exciting sequence. A strong teaser
            should prove the concept quickly and leave viewers wanting more.
          </p>
        </div>

        <div className={styles.demoPanel}>
          <div>
            <h3>Suggested 2-minute structure</h3>
            <ol className={styles.demoSteps}>
              <li>Open with the home screen and establish the game-show energy.</li>
              <li>Play one short round so viewers see pacing, questions, and feedback.</li>
              <li>End by revealing custom quiz creation and future replay value.</li>
            </ol>
          </div>

          <div className={styles.demoCallout}>
            <p className={styles.demoBadge}>Best CTA</p>
            <p>
              This page works whether your final teaser is a narrated screen
              recording or an interactive preview. The important part is that it
              feels curated.
            </p>
            <Link href="/play" className={styles.tertiaryButton}>
              Launch Gameplay
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Demo Beats</p>
          <h2>The teaser should move fast and showcase only the strongest moments.</h2>
        </div>

        <div className={styles.momentGrid}>
          {teaserBeats.map((beat) => (
            <article key={beat.step} className={styles.momentCard}>
              <span>{beat.step}</span>
              <h3>{beat.title}</h3>
              <p>{beat.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
