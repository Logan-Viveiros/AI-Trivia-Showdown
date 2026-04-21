"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { Quiz } from "@/quizzes/quiz";
import { GameData, Games, games } from "@/games";
import { doc, getDoc } from "firebase/firestore";
import { quizzesCollection } from "@/utils/firebase.browser";

function LobbyCreateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const quizId = searchParams.get("quiz")

    if (!quizId) {
        router.push("/search-quizzes");
        return null;
    }

    const [selectedQuiz, setSelectedQuiz] = useState<Quiz>(null as unknown as Quiz);

    useEffect(() => {
        loadSelectedQuiz();
    }, []);

    const loadSelectedQuiz = async () => {
        const quiz = await getDoc(doc(quizzesCollection, quizId)).then((doc) => {
            return doc.exists() ? { id: doc.id, ...doc.data() } : null;
        });
        if (!quiz) {
            router.push("/search-quizzes");
        }
        setSelectedQuiz(quiz as Quiz);
    };

    const [selectedGameType, setSelectedGameType] = useState<"classic" | null>(null);
    const [endCondition, setEndCondition] = useState<"time" | "score">("score");
    const [endValue, setEndValue] = useState(10);

    const [gameDropdownOpen, setGameDropdownOpen] = useState(false);

    const availableGames = games

    const handleGameSelect = (game: "classic") => {
        setSelectedGameType(game);
        setGameDropdownOpen(false);
    };

    const handleStart = () => {
        if (!selectedGameType) return;
        // Convert minutes to seconds if time is selected
        const finalEndValue =
            endCondition === "time" ? endValue * 60 : endValue;
        router.push(
            `/play?type=${selectedGameType}&quiz=${quizId}&endCondition=${endCondition}&endValue=${finalEndValue}`,
        );
    };

    const selectedGameName = availableGames[selectedGameType!]?.name;

    return selectedQuiz ? (
        <div className="flex min-h-screen items-center justify-center bg-[#de7c5a] px-6 py-12">
            <div className="w-full max-w-md space-y-8 rounded-3xl border-4 border-[#7f061d] bg-[#b10f2e] p-8 shadow-2xl">
                {/* Quiz Name */}
                <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#ffe7d5]">
                        Quiz Selected
                    </p>
                    <h1 className="mt-2 font-[family:var(--font-display)] text-3xl tracking-[0.08em] text-[#280000] drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                        {selectedQuiz.name}
                    </h1>
                </div>

                {/* Game Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-[0.25em] text-[#ffe7d5]">
                        Game:
                    </label>

                    <button
                        onClick={() => setGameDropdownOpen(!gameDropdownOpen)}
                        className={`w-full rounded-xl border-3 px-4 py-3 font-bold transition ${selectedGameType
                            ? "border-[#ffe7d5] bg-[#f7d9bd] text-[#b10f2e]"
                            : "border-[#ffe7d5] bg-[#f7d9bd] text-[#b10f2e] hover:bg-[#ffe7d3]"
                            }`}
                    >
                        {selectedGameName || "Choose game"}
                    </button>

                    {gameDropdownOpen && (
                        <div className="space-y-2 rounded-xl border-3 border-[#ffe7d5]/20 bg-[#8f0820] p-3">
                            {(Object.entries(availableGames) as [Games, GameData][]).map(([id, game]) => (
                                <button
                                    key={id}
                                    onClick={() => handleGameSelect(id)}
                                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-bold transition ${selectedGameType === id
                                        ? "bg-[#ffe7d5] text-[#b10f2e]"
                                        : "bg-[#b10f2e] text-[#ffe7d5] hover:bg-[#ca1a3a]"
                                        }`}
                                >
                                    {game.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* End By Section */}
                <div className="space-y-4">
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ffe7d5]">
                        End By?
                    </p>

                    {/* Time/Score Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setEndCondition("time")}
                            className={`flex-1 rounded-xl px-4 py-4 font-bold transition ${endCondition === "time"
                                ? "border-4 border-[#ffe7d5] bg-[#f7d9bd] text-[#b10f2e]"
                                : "border-3 border-[#ffe7d5]/30 bg-[#8f0820] text-[#ffe7d5] hover:bg-[#a01030]"
                                }`}
                        >
                            Time
                        </button>
                        <button
                            onClick={() => setEndCondition("score")}
                            className={`flex-1 rounded-xl px-4 py-4 font-bold transition ${endCondition === "score"
                                ? "border-4 border-[#ffe7d5] bg-[#f7d9bd] text-[#b10f2e]"
                                : "border-3 border-[#ffe7d5]/30 bg-[#8f0820] text-[#ffe7d5] hover:bg-[#a01030]"
                                }`}
                        >
                            Score
                        </button>
                    </div>

                    {/* Input */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-[0.25em] text-[#ffe7d5]/80">
                            {endCondition === "time" ? "Time (minutes)" : "Score (points)"}
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={endCondition === "time" ? 60 : 100}
                            value={endValue}
                            onChange={(e) =>
                                setEndValue(Math.max(1, parseInt(e.target.value) || 1))
                            }
                            className="mt-2 w-full rounded-xl border-3 border-[#b10f2e] bg-[#f7d9bd] px-4 py-3 font-bold text-[#b10f2e] placeholder-[#b10f2e]/40 focus:border-[#ffe7d5] focus:outline-none focus:ring-2 focus:ring-[#ffe7d5]/20"
                        />
                    </div>
                </div>

                {/* Start Button */}
                <button
                    onClick={handleStart}
                    disabled={!selectedGameType}
                    className={`w-full rounded-2xl border-4 px-6 py-4 font-[family:var(--font-display)] text-3xl font-bold transition ${selectedGameType
                        ? "border-[#ffe7d5] bg-[#f7d9bd] text-[#b10f2e] hover:bg-[#ffe7d3] active:scale-95"
                        : "border-[#ffe7d5]/30 bg-[#8f0820] text-[#ffe7d5]/50 cursor-not-allowed"
                        }`}
                >
                    Start
                </button>

                {/* Back Link */}
                <div className="text-center">
                    <Link
                        href="/search-quizzes"
                        className="text-sm font-bold text-[#ffe7d5] underline transition hover:text-white"
                    >
                        ← Change Quiz
                    </Link>
                </div>
            </div>
        </div>
    ) : null;
}

export default function LobbyCreatePage() {
    return (
        <Suspense fallback={<div>Loading lobby...</div>}>
            <LobbyCreateContent />
        </Suspense>
    );
}