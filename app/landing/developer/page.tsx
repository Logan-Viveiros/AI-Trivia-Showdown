import type { Metadata } from "next";
import styles from "../landing.module.css";
import { developerHighlights, skillTags } from "../landing-content";

export const metadata: Metadata = {
  title: "Developer | AI Trivia Showdown",
  description:
    "A portfolio-style developer page for the creator of AI Trivia Showdown, highlighting goals, skills, and project growth.",
};

export default function DeveloperPage() {
  return (
    <main className={styles.contentStack}>
      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>About the Developer</p>
          <h1 className={styles.pageTitle}>A student builder focused on making school tools feel more memorable.</h1>
          <p className={styles.pageIntro}>
            This project was created as both a programming challenge and a
            creative product-design exercise. The goal was not just to make a
            working app, but to make something with enough personality that a
            visitor could imagine it as a real launch.
          </p>
        </div>

        <div className={styles.developerGrid}>
          <article className={styles.portraitCard}>
            {/* <div className={styles.portraitPlaceholder} aria-hidden="true">
              <div className={styles.portraitHalo} />
              <div className={styles.portraitHead} />
              <div className={styles.portraitBody} />
            </div> */}
            <img src="/guy.png" alt="Developer portrait" />
          </article>

          <article className={styles.checklistCard}>
            <h3>Developer's Previous Skills</h3>
            <ul className={styles.checklist}>
              {developerHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Skills Learned</p>
          <h2>This project mixed code, design, AI prompting, and presentation.</h2>
        </div>

        <div className={styles.triviaTagList}>
          {skillTags.map((skill) => (
            <span key={skill} className={styles.triviaTag}>
              {skill}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
