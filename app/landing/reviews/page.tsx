import type { Metadata } from "next";
import styles from "../landing.module.css";
import { reviews } from "../landing-content";

export const metadata: Metadata = {
  title: "AI Reviews | AI Trivia Showdown",
  description:
    "AI-generated reviews of AI Trivia Showdown from the perspective of a software engineer, company executive, game studio, and target demographic.",
};

export default function ReviewsPage() {
  return (
    <main className={styles.contentStack}>
      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>AI-Generated Reviews</p>
          <h1 className={styles.pageTitle}>Four imagined perspectives on the same launch.</h1>
          <p className={styles.pageIntro}>
            These reviews are written as if AI Trivia Showdown has been critiqued
            by different professional audiences. Each one emphasizes different
            priorities, which makes the page useful both as marketing content and
            as reflection on the project.
          </p>
        </div>

        <div className={styles.reviewGrid}>
          {reviews.map((review) => (
            <article key={review.role} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <p className={styles.reviewRole}>{review.role}</p>
                <strong>{review.score}</strong>
              </div>
              <h3>{review.headline}</h3>
              <p className={styles.reviewQuote}>{review.quote}</p>
              <p className={styles.reviewVerdict}>{review.verdict}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
