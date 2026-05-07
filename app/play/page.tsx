"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Quiz } from "@/quizzes/quiz";
import Game from "@/games/gamePlayer";
import { games } from "@/games/index";
import { doc, getDoc } from "@firebase/firestore";
import { quizzesCollection } from "@/utils/firebase.browser";

function PlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quiz");
  if (!quizId) {
    router.push("/search-quizzes");
    return null;
  }
  const gameType = (searchParams.get("type") ?? "classic") as string;
  const endCondition = (searchParams.get("endCondition") ?? "score") as "score" | "time";
  const endValue = parseInt(searchParams.get("endValue") ?? "10", 10);

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

  return selectedQuiz ? (
    <Game quiz={selectedQuiz} game={games.classic.game} config={{ endCondition, endValue }} quizId={quizId} gameType={gameType} demo={false} />
  ) : null;
  // return <ClassicQuiz quiz={selectedQuiz} />;
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div>Loading game...</div>}>
      <PlayContent />
    </Suspense>
  );
}
