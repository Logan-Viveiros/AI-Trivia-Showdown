"use client";

import { useEffect, useState } from "react";
import styles from "../landing.module.css";
import { teaserBeats } from "../landing-content";
import GamePlayer from "@/games/gamePlayer";
import { games } from "@/games";
import { Quiz } from "@/quizzes/quiz";
import { doc, getDoc } from "firebase/firestore";
import { quizzesCollection } from "@/utils/firebase.browser";

// Note: Metadata is not supported in client components

export default function TeaserPage() {
  const [showingDemo, setShowingDemo] = useState(false);
  const [demoQuiz, setSelectedQuiz] = useState<Quiz>(null as unknown as Quiz);

  useEffect(() => {
    loadSelectedQuiz();
  }, []);

  const loadSelectedQuiz = async () => {
    const quiz = await getDoc(doc(quizzesCollection, "Yb9UzhXds9oJXIWG911q")).then((doc) => {
      return doc.exists() ? { id: doc.id, ...doc.data() } : null;
    });
    setSelectedQuiz(quiz as Quiz);
  };

  const demoConfig = {
    endCondition: "score" as const,
    endValue: 3, // Play one question for demo
  };

  if (showingDemo) {
    return (
      <div className="relative min-h-screen">
        <button
          onClick={() => setShowingDemo(false)}
          className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Close Demo
        </button>
        <GamePlayer
          quiz={demoQuiz}
          game={games.classic.game}
          config={demoConfig}
          quizId="demo-general"
          gameType="classic"
          demo={true}
          onDemoEnd={() => setShowingDemo(false)}
        />
      </div>
    );
  }

  return (
    <main className={styles.contentStack}>
      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Quick Demo</p>
          <h1 className={styles.pageTitle}>Try it for yourself.</h1>
          <p className={styles.pageIntro}>
            Get a taste of AI Trivia Showdown with an interactive demo. Answer one
            quick question to experience the excitement, then dive into the full game
            with unlimited quizzes, custom challenges, and multiplayer battles.
          </p>
        </div>

        <div className={styles.demoPanel}>
          <div>
            <h3>In this demo, you'll:</h3>
            <ol className={styles.demoSteps}>
              <li>Experience the game-show energy and fast-paced gameplay.</li>
              <li>Answer a question and see instant feedback.</li>
              <li>Discover what's waiting for you in the full version.</li>
            </ol>
          </div>

          <div className={styles.demoCallout}>
            <p className={styles.demoBadge}>Ready?</p>
            <p>
              Play this quick demo to get a feel for the intensity and fun of
              AI Trivia Showdown. The full game has much more in store for you.
            </p>
            <button
              onClick={() => setShowingDemo(true)}
              className={styles.tertiaryButton}
            >
              Play Demo
            </button>
          </div>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>What's Included</p>
          <h2>There's so much more waiting in the full game.</h2>
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
