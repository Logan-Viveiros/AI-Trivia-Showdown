"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Quiz } from "@/quizzes/quiz";
import { addDoc } from "firebase/firestore";
import { quizzesCollection } from "@/utils/firebase.browser";
import Link from "next/link";

export default function CreateQuizPage() {
  const router = useRouter();
  const [createdQuizzes, setCreatedQuizzes] = useState<string[]>([]);
  const [quizzes, setQuizzes] = useState<Map<string, Quiz>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load created quiz IDs from localStorage
    const stored = localStorage.getItem("createdQuizzes");
    const quizIds = stored ? JSON.parse(stored) : [];
    setCreatedQuizzes(quizIds);
  }, []);

  useEffect(() => {
    // In the future, fetch quiz data from Firebase for display
    // For now, we just have the IDs
    setIsLoading(false);
  }, [createdQuizzes]);

  const handleCreateNewQuiz = async () => {
    try {
      // Create a new quiz document in Firebase
      const newQuiz: Omit<Quiz, "id"> = {
        name: "Untitled Quiz",
        questions: [],
      };

      const docRef = await addDoc(quizzesCollection, newQuiz);
      const quizId = docRef.id;

      // Add to localStorage
      const updated = [...createdQuizzes, quizId];
      localStorage.setItem("createdQuizzes", JSON.stringify(updated));

      // Navigate to quiz builder
      router.push(`/create-quiz/${quizId}`);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz. Please try again.");
    }
  };

  const handleSelectQuiz = (quizId: string) => {
    router.push(`/create-quiz/${quizId}`);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="text-center text-[#7f061d]">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link
            href="/"
            className="mb-6 inline-block text-sm font-bold text-[#7f061d]/70 transition hover:text-[#7f061d]"
          >
            ← Back to Menu
          </Link>
          <h1 className="font-[family:var(--font-display)] text-5xl text-[#b10f2e] drop-shadow-[0_6px_0_rgba(87,0,0,0.12)]">
            Your Quizzes
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid gap-8">
          {/* Create New Quiz Button */}
          <button
            onClick={handleCreateNewQuiz}
            className="group relative inline-flex min-h-24 items-center justify-center overflow-hidden rounded-[2rem] border-4 border-[#7f061d] bg-[#b10f2e] px-8 text-center shadow-[0_16px_0_0_#570000,0_28px_50px_-18px_rgba(87,0,0,0.6)] transition duration-200 ease-out hover:-translate-y-1 hover:bg-[#ca1a3a] hover:shadow-[0_20px_0_0_#570000,0_34px_56px_-18px_rgba(87,0,0,0.72)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe5c9] focus-visible:ring-offset-4 focus-visible:ring-offset-[#de7c5a] active:translate-y-3 active:bg-[#8f0820] active:shadow-[0_8px_0_0_#570000,0_16px_30px_-16px_rgba(87,0,0,0.58)]"
          >
            <span className="absolute inset-x-5 top-2 h-5 rounded-full bg-white/20 blur-md transition duration-200 group-hover:bg-white/30" />
            <span className="font-[family:var(--font-display)] text-4xl tracking-[0.08em] text-white sm:text-5xl">
              Create New Quiz
            </span>
          </button>

          {/* Previously Created Quizzes */}
          {createdQuizzes.length > 0 && (
            <div>
              <h2 className="mb-6 font-[family:var(--font-display)] text-3xl text-[#7f061d]">
                Your Created Quizzes
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {createdQuizzes.map((quizId) => (
                  <button
                    key={quizId}
                    onClick={() => handleSelectQuiz(quizId)}
                    className="rounded-[1.6rem] border-4 border-[#7f061d]/85 bg-[#f7d9bd] px-6 py-6 text-left transition duration-200 hover:-translate-y-1 hover:bg-[#ffe7d3] hover:shadow-[0_14px_0_0_rgba(87,0,0,0.26)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe5c9] focus-visible:ring-offset-4 focus-visible:ring-offset-[#de7c5a] active:translate-y-2 active:shadow-[0_5px_0_0_rgba(87,0,0,0.22)] shadow-[0_10px_0_0_rgba(87,0,0,0.22)]"
                  >
                    <p className="font-bold text-[#7f061d]">Quiz ID:</p>
                    <p className="break-all text-sm text-[#7f061d]/70">{quizId}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {createdQuizzes.length === 0 && (
            <div className="text-center">
              <p className="text-xl text-[#5c0a14]/80">
                You haven't created any quizzes yet. Click the button above to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
