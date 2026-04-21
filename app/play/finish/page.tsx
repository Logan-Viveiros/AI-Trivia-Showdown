"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Quiz } from "@/quizzes/quiz";
import { doc, getDoc } from "@firebase/firestore";
import { quizzesCollection } from "@/utils/firebase.browser";
import { Games, games } from "@/games";

function FinishContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const quizId = searchParams.get("quiz");
    const score = searchParams.get("score");
    const gameType = (searchParams.get("gameType") as Games) || "classic";

    const [selectedQuiz, setSelectedQuiz] = useState<Quiz>(null as unknown as Quiz);

    useEffect(() => {
        if (!quizId) {
            router.push("/search-quizzes");
            return;
        }
        loadSelectedQuiz();
    }, [quizId]);

    const loadSelectedQuiz = async () => {
        if (!quizId) return;
        const quiz = await getDoc(doc(quizzesCollection, quizId)).then((doc) => {
            return doc.exists() ? { id: doc.id, ...doc.data() } : null;
        });
        if (!quiz) {
            router.push("/search-quizzes");
        }
        setSelectedQuiz(quiz as Quiz);
    };

    const handlePlayAgain = () => {
        if (!quizId) return;
        router.push(`/lobby/create?quiz=${quizId}`);
    };

    const handleMenu = () => {
        router.push("/");
    };

    const gameName = games[gameType]?.name || "Quiz";

    return selectedQuiz ? (
        <div className="flex min-h-screen items-center justify-center bg-[#de7c5a] px-6 py-12">
            <div className="w-full max-w-md space-y-8 rounded-3xl border-4 border-[#7f061d] bg-[#b10f2e] p-8 shadow-2xl">
                {/* Header */}
                <div className="text-center">
                    <h1 className="font-[family:var(--font-display)] text-4xl font-bold tracking-[0.08em] text-[#ffe7d5] drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                        Quiz Finished
                    </h1>
                </div>

                {/* Quiz Info */}
                <div className="space-y-2 text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ffe7d5]">
                        {selectedQuiz.name}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffe7d5]/75">
                        {gameName}
                    </p>
                </div>

                {/* Score Display */}
                <div className="rounded-2xl border-3 border-[#ffe7d5] bg-[#8f0820] py-6 text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ffe7d5]/75">
                        Score
                    </p>
                    <p className="text-5xl font-extrabold text-[#ffe7d5]">
                        {score || 0}
                    </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handlePlayAgain}
                        className="w-full rounded-2xl border-3 border-[#ffe7d5] bg-[#f7d9bd] px-6 py-4 font-bold text-[#b10f2e] transition hover:bg-[#ffe7d3] hover:shadow-lg active:scale-95"
                    >
                        Play Again
                    </button>
                    <button
                        onClick={handleMenu}
                        className="w-full rounded-2xl border-3 border-[#ffe7d5] bg-[#ca1a3a] px-6 py-4 font-bold text-[#ffe7d5] transition hover:bg-[#e02549] hover:shadow-lg active:scale-95"
                    >
                        Menu
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}

export default function FinishPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FinishContent />
        </Suspense>
    );
}
