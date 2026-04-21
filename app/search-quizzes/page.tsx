"use client"

import Link from "next/link";
import { Quiz } from "@/quizzes/quiz";
import { quizzesCollection } from "@/utils/firebase.browser";
import { getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

async function getAllQuizzes() {
  const quizzes = await getDocs(quizzesCollection).then((querySnapshot) => {
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }).catch((error) => {
    console.error("Error fetching quizzes: ", error);
    return [];
  }) as Quiz[];
  return quizzes
}

// addQuizzesToFirestore();

export default function SearchQuizzesPage() {
  const [quizzes, setQuizzes] = useState([] as Quiz[])

  useEffect(() => {
    fetchQuizzes();
  }, [])

  const fetchQuizzes = async () => {
    const quizzesData = await getAllQuizzes();
    setQuizzes(quizzesData);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(255,236,214,0.48),_transparent_68%)]"
      />

      <section className="relative flex w-full max-w-4xl flex-col items-center gap-12">
        <div className="space-y-3 text-center">
          <h1 className="font-[family:var(--font-display)] text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[0.02em] text-[#b10f2e] drop-shadow-[0_6px_0_rgba(87,0,0,0.12)]">
            Select a Quiz
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[#5c0a14]/78 sm:text-xl">
            Choose a quiz to get started, then customize your game experience
          </p>
        </div>

        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/lobby/create?quiz=${quiz.id}`}
              className="group flex flex-col gap-3 rounded-2xl border-4 border-[#7f061d] bg-gradient-to-br from-[#b10f2e] to-[#8f0820] p-6 shadow-[0_16px_0_0_#570000,0_28px_50px_-18px_rgba(87,0,0,0.6)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_0_0_#570000,0_34px_56px_-18px_rgba(87,0,0,0.72)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe5c9]"
            >
              <div className="space-y-2">
                <h2 className="font-[family:var(--font-display)] text-2xl tracking-[0.08em] text-[#280000] transition group-hover:text-white sm:text-3xl">
                  {quiz.name}
                </h2>
              </div>
              <div className="flex items-center justify-between border-t border-[#ffe7d5]/20 pt-3">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#ffe7d5]/70">
                  {quiz.questions.length} Questions
                </span>
                <span className="text-xl transition group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="text-center font-bold text-[#b10f2e] underline transition hover:text-[#8f0820]"
        >
          ← Back to Home
        </Link>
      </section>
    </main>
  );
}
