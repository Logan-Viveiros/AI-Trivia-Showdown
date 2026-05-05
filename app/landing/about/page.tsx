import type { Metadata } from "next";
import styles from "../landing.module.css";
import { aboutSections, featureCards, keyFeatures } from "../landing-content";

export const metadata: Metadata = {
  title: "About | AI Trivia Showdown",
  description:
    "Information about AI Trivia Showdown, including what it is, how it works, and what makes the project stand out.",
};

export default function AboutPage() {
  return (
    <main className={styles.contentStack}>
      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>About / Info</p>
          <h1 className={styles.pageTitle}>Trivia built to feel louder, faster, and more alive.</h1>
          <p className={styles.pageIntro}>
            AI Trivia Showdown is a quiz experience designed to make study and
            review feel more like a challenge worth replaying. Instead of
            presenting questions in a flat format, the project leans into a bold
            game-show tone and a custom quiz pipeline that can keep expanding.
          </p>
        </div>

        <div className={styles.pageGrid}>
          {aboutSections.map((section) => (
            <article key={section.title} className={styles.pageCard}>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Key Features</p>
          <h2>The project combines classroom usefulness with stronger game presentation.</h2>
        </div>

        <div className={styles.featureGrid}>
          {featureCards.map((feature) => (
            <article key={feature.title} className={styles.featureCard}>
              <div className={styles.featureAccent} aria-hidden="true" />
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>

        <article className={styles.checklistCard}>
          <h3>What makes it special</h3>
          <ul className={styles.checklist}>
            {keyFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
