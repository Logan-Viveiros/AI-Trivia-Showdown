"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Question, Quiz } from "@/quizzes/quiz";
import type { GameAPI, GameConfig } from "@/games/types";

const ANSWER_BASE_STYLES = [
  "bg-[#ff1630]",
  "bg-[#169ede]",
  "bg-[#26b94a]",
  "bg-[#ffea00]",
] as const;

const ADVANCE_DELAY_MS = 2200;

function displayQuestion(question: Question) {

}

function chooseNextQuestionIndex(
  totalQuestions: number,
  currentIndex: number,
  recentHistory: number[],
) {
  if (totalQuestions <= 1) {
    return 0;
  }

  const candidates = Array.from({ length: totalQuestions }, (_, index) => index);
  const weightedCandidates = candidates.flatMap((index) => {
    if (index === currentIndex) {
      return [];
    }

    if (index === recentHistory[recentHistory.length - 2]) {
      return [index];
    }

    return [index, index, index];
  });

  const pool = weightedCandidates.length > 0 ? weightedCandidates : candidates;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getAnswerState(
  answerIndex: number,
  chosenAnswerIndex: number | null,
  correctAnswers: number[],
) {
  if (chosenAnswerIndex === null) {
    return {
      containerClass: ANSWER_BASE_STYLES[answerIndex % ANSWER_BASE_STYLES.length],
      textClass: "text-white",
    };
  }

  if (correctAnswers.includes(answerIndex)) {
    return {
      containerClass: "bg-[#41cb69]",
      textClass: "text-white",
    };
  }

  return {
    containerClass: "bg-[#ef4d4d]",
    textClass: "text-white",
  };
}

export default function Game({ quiz, game, config, quizId, gameType, demo, onDemoEnd }: { quiz: Quiz, game: GameAPI, config: GameConfig, quizId: string, gameType: string, demo: boolean, onDemoEnd?: () => void }) {
  const router = useRouter();

  const [state, setState] = useState(() => game.initialize(config));
  const [showingQuestion, setShowingQuestion] = useState(state.requestQuestion ?? false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recentHistory, setRecentHistory] = useState([0]);
  const [chosenAnswerIndex, setChosenAnswerIndex] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = chosenAnswerIndex !== null;

  // Handle game end detection and navigation
  useEffect(() => {
    const isGameOver = state.gameOver ||
      (config.endCondition === "score" && state.score >= config.endValue) ||
      (config.endCondition === "time" && elapsedSeconds >= config.endValue);

    if (isGameOver) {
      if (demo && onDemoEnd) {
        onDemoEnd();
      } else {
        router.push(`/play/finish?quiz=${quizId}&gameType=${gameType}&score=${state.score}`);
      }
    }
  }, [state.gameOver, state.score, elapsedSeconds, config, quizId, gameType, router, demo, onDemoEnd]);

  // Time tracking effect
  useEffect(() => {
    if (config.endCondition !== "time") {
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [config.endCondition]);

  const finishQuestion = useCallback(() => {
    if (chosenAnswerIndex === null) {
      return;
    }
    if (currentQuestion.correct.includes(chosenAnswerIndex)) {
      setState((prev) => game.onCorrectAnswer(prev));
    } else {
      setState((prev) => game.onWrongAnswer(prev));
    }
    setShowingQuestion(false);
    setChosenAnswerIndex(null);
  }, [currentQuestionIndex, chosenAnswerIndex, recentHistory]);

  const getQuestion = useCallback(() => {
    const nextIndex = chooseNextQuestionIndex(
      quiz.questions.length,
      currentQuestionIndex,
      recentHistory,
    );
    setCurrentQuestionIndex(nextIndex);
    setRecentHistory((history) => [...history.slice(-2), nextIndex]);
  }, [currentQuestionIndex, quiz.questions.length, recentHistory]);

  useEffect(() => {
    if (chosenAnswerIndex === null) {
      return;
    }

    const timeout = window.setTimeout(finishQuestion, ADVANCE_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [finishQuestion, chosenAnswerIndex]);

  useEffect(() => {
    if (state.requestQuestion) {
      getQuestion();
      setShowingQuestion(true);
      setState((prev) => ({ ...prev, requestQuestion: false }));
    }
  }, [state.requestQuestion, getQuestion]);

  return showingQuestion ? (
    <main
      onClick={() => {
        if (isAnswered) {
          finishQuestion();
        }
      }}
      className="flex min-h-screen flex-col bg-transparent"
    >
      <div className="flex flex-1 flex-col px-3 py-3 sm:px-8 sm:py-6">
        <header className="pb-4 text-left">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffe7d5] sm:text-base">
            {quiz.name}
          </p>
        </header>

        <section className="flex min-h-[16rem] flex-1 items-center justify-center px-4 pb-8 pt-4 text-center sm:min-h-[20rem]">
          <div className="max-w-4xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#ffe7d5]/75 sm:text-sm">
              {game.name}
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-[#fff7f0] sm:text-6xl">
              {currentQuestion.question}
            </h1>
            {isAnswered ? (
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#fff1df]/80 sm:text-base">
                Click anywhere to continue
              </p>
            ) : null}
          </div>
        </section>
      </div>

      <section className="grid min-h-[46vh] grid-cols-1 gap-1.5 px-1.5 pb-1.5 sm:grid-cols-2 sm:gap-2 sm:px-2 sm:pb-2">
        {currentQuestion.answers.map((answer, answerIndex) => {
          const answerState = getAnswerState(
            answerIndex,
            chosenAnswerIndex,
            currentQuestion.correct,
          );
          const isAnswered = chosenAnswerIndex !== null;

          return (
            <button
              key={`${currentQuestion.question}-${answer}`}
              type="button"
              disabled={isAnswered}
              onClick={(e) => {
                e.stopPropagation();
                setChosenAnswerIndex(answerIndex);
              }}
              className={`flex min-h-40 items-center justify-center px-6 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition duration-200 ease-out sm:min-h-56 ${answerState.containerClass} ${isAnswered
                ? "scale-[0.985] animate-[answerReveal_420ms_ease-out]"
                : "hover:-translate-y-1 hover:brightness-110 hover:shadow-[0_14px_28px_-16px_rgba(0,0,0,0.45)] active:translate-y-1 active:scale-[0.985]"
                }`}
            >
              <span
                className={`text-4xl font-extrabold drop-shadow-[0_3px_8px_rgba(0,0,0,0.22)] sm:text-6xl ${answerState.textClass}`}
              >
                {answer}
              </span>
            </button>
          );
        })}
      </section>
    </main>
  ) : game.render(state);
}
