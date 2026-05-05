import type { Metadata } from "next";
import Link from "next/link";
import styles from "./landing.module.css";
import { HeroArtwork, SiteMapCards } from "./landing-content";

export const metadata: Metadata = {
  title: "Landing | AI Trivia Showdown",
  description:
    "The front door of the AI Trivia Showdown launch site, guiding visitors into the demo, project details, developer page, and AI-generated reviews.",
};

export default function LandingHomePage() {
  return (
    <main className={styles.contentStack}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>First Look</p>
          <h1 className={styles.heroTitle}>AI Trivia Showdown</h1>
          <p className={styles.tagline}>
            A trivia battleground where custom quizzes, quick
            rounds, and AI-powered creation turn ordinary review into a real
            showdown.
          </p>
          {/* <p className={styles.heroBody}>
            This is the front door of the launch site. Its job is simple:
            introduce the project, make the vibe clear fast, and point visitors
            toward the pages that sell the experience best.
          </p> */}

          <div className={styles.heroActions}>
            <Link href="/landing/teaser" className={styles.primaryButton}>
              Watch Demo Page
            </Link>
            <Link href="/landing/about" className={styles.secondaryButton}>
              Learn About the Project
            </Link>
            <Link href="/play" className={styles.ghostButton}>
              Play the Live Build
            </Link>
          </div>

          {/* <ul className={styles.quickFacts} aria-label="Launch highlights">
            <li>Built to feel like a real product launch</li>
            <li>Links directly to every required assignment page</li>
            <li>Uses polished, final marketing copy</li>
          </ul> */}
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.visualFrame}>
            <HeroArtwork />
          </div>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        {/* <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Site Map</p>
          <h2>Everything important branches out from here.</h2>
        </div> */}

        <SiteMapCards />
      </section>
    </main>
  );
}
