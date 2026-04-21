"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Quiz, Question } from "@/quizzes/quiz";
import {
    doc,
    getDoc,
    updateDoc,
    Timestamp,
    DocumentData,
} from "firebase/firestore";
import { db } from "@/utils/firebase.browser";
import { promptQuestions } from "@/utils/ai";
import Link from "next/link";

type AIModalState = "closed" | "open" | "loading" | "success" | "error";

interface QuizBuilderParams {
    id: string;
    [key: string]: string;
}

export default function QuizBuilderPage() {
    const params = useParams<QuizBuilderParams>();
    const router = useRouter();
    const quizId = params.id;

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
        "idle"
    );

    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
        number | null
    >(null);
    const [aiModalState, setAIModalState] = useState<AIModalState>("closed");
    const [aiPrompt, setAIPrompt] = useState("");
    const [aiQuestionCount, setAiQuestionCount] = useState(5);
    const [aiError, setAIError] = useState<string | null>(null);

    //@ts-ignore
    const saveTimeoutRef = useRef<NodeJS.Timeout>();

    // Load quiz from Firebase
    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const docRef = doc(db, "quizzes", quizId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Omit<Quiz, "id">;
                    setQuiz({
                        ...data,
                        id: quizId,
                    });
                    if (data.questions.length > 0) {
                        setSelectedQuestionIndex(0);
                    }
                } else {
                    console.error("Quiz not found");
                    router.push("/create-quiz");
                }
            } catch (error) {
                console.error("Error loading quiz:", error);
                router.push("/create-quiz");
            } finally {
                setIsLoading(false);
            }
        };

        loadQuiz();
    }, [quizId, router]);

    // Debounced save to Firebase
    const saveQuizToFirebase = useCallback(async (quizData: Quiz) => {
        try {
            setSaveStatus("saving");
            const docRef = doc(db, "quizzes", quizData.id);
            // Remove id before saving to Firebase (it's stored as doc ID)
            const { id, ...dataToSave } = quizData;
            await updateDoc(docRef, dataToSave);
            setSaveStatus("saved");

            // Reset status after 2 seconds
            setTimeout(() => setSaveStatus("idle"), 2000);
        } catch (error) {
            console.error("Error saving quiz:", error);
            setSaveStatus("idle");
        }
    }, []);

    // Debounced auto-save
    const debouncedSave = useCallback(
        (quizData: Quiz) => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = setTimeout(() => {
                saveQuizToFirebase(quizData);
            }, 500);
        },
        [saveQuizToFirebase]
    );

    // Manual save
    const handleManualSave = useCallback(() => {
        if (quiz) {
            saveQuizToFirebase(quiz);
        }
    }, [quiz, saveQuizToFirebase]);

    const currentQuestion =
        selectedQuestionIndex !== null && quiz
            ? quiz.questions[selectedQuestionIndex]
            : null;

    const handleQuizNameChange = (newName: string) => {
        if (quiz) {
            const updated = { ...quiz, name: newName };
            setQuiz(updated);
            debouncedSave(updated);
        }
    };

    const handleQuestionChange = (field: string, value: any) => {
        if (quiz && selectedQuestionIndex !== null) {
            const updatedQuestions = [...quiz.questions];
            updatedQuestions[selectedQuestionIndex] = {
                ...updatedQuestions[selectedQuestionIndex],
                [field]: value,
            };
            const updated = { ...quiz, questions: updatedQuestions };
            setQuiz(updated);
            debouncedSave(updated);
        }
    };

    const handleAnswerChange = (answerIndex: number, newText: string) => {
        if (quiz && selectedQuestionIndex !== null) {
            const updatedQuestions = [...quiz.questions];
            const answers = [...updatedQuestions[selectedQuestionIndex].answers];
            answers[answerIndex] = newText;
            updatedQuestions[selectedQuestionIndex].answers = answers;
            const updated = { ...quiz, questions: updatedQuestions };
            setQuiz(updated);
            debouncedSave(updated);
        }
    };

    const handleCorrectAnswerToggle = (answerIndex: number) => {
        if (quiz && selectedQuestionIndex !== null) {
            const updatedQuestions = [...quiz.questions];
            const correct = [...updatedQuestions[selectedQuestionIndex].correct];
            const idx = correct.indexOf(answerIndex);

            if (idx > -1) {
                correct.splice(idx, 1);
            } else {
                correct.push(answerIndex);
            }

            updatedQuestions[selectedQuestionIndex].correct = correct;
            const updated = { ...quiz, questions: updatedQuestions };
            setQuiz(updated);
            debouncedSave(updated);
        }
    };

    const handleAddQuestion = () => {
        if (quiz) {
            const newQuestion: Question = {
                question: "New Question",
                answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
                correct: [0],
            };
            const updated = {
                ...quiz,
                questions: [...quiz.questions, newQuestion],
            };
            setQuiz(updated);
            setSelectedQuestionIndex(updated.questions.length - 1);
            debouncedSave(updated);
        }
    };

    const handleDeleteQuestion = (index: number) => {
        if (quiz) {
            const updated = {
                ...quiz,
                questions: quiz.questions.filter((_, i) => i !== index),
            };
            setQuiz(updated);

            // Adjust selected index
            if (selectedQuestionIndex === index) {
                setSelectedQuestionIndex(
                    index > 0 ? index - 1 : updated.questions.length > 0 ? 0 : null
                );
            } else if (selectedQuestionIndex && selectedQuestionIndex > index) {
                setSelectedQuestionIndex(selectedQuestionIndex - 1);
            }

            debouncedSave(updated);
        }
    };

    const handleAIPromptSubmit = async () => {
        if (!aiPrompt.trim()) {
            setAIError("Please enter a prompt");
            return;
        }

        try {
            setAIModalState("loading");
            setAIError(null);

            // Call the async function that will be provided
            const newQuestions = await promptQuestions(aiPrompt, aiQuestionCount);

            if (quiz) {
                const updated = {
                    ...quiz,
                    questions: [...quiz.questions, ...newQuestions],
                };
                setQuiz(updated);
                setSelectedQuestionIndex(quiz.questions.length); // Select first new question
                debouncedSave(updated);
            }

            setAIModalState("success");
            setAIPrompt("");

            // Close modal after 1.5 seconds
            setTimeout(() => setAIModalState("closed"), 1500);
        } catch (error) {
            console.error("Error generating questions:", error);
            setAIError("AI failed to create questions");
            setAIModalState("error");
        }
    };

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center px-6 py-12">
                <div className="text-center text-[#7f061d]">Loading quiz...</div>
            </main>
        );
    }

    if (!quiz) {
        return (
            <main className="flex min-h-screen items-center justify-center px-6 py-12">
                <div className="text-center text-[#7f061d]">Quiz not found</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#f7d9bd] to-[#ffe7d3] px-6 py-12">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <Link
                        href="/create-quiz"
                        className="text-sm font-bold text-[#7f061d]/70 transition hover:text-[#7f061d]"
                    >
                        ← Back to Your Quizzes
                    </Link>

                    <div className="flex gap-4">
                        {/* Save Status Indicator */}
                        {saveStatus === "saving" && (
                            <div className="px-4 py-2 text-sm font-bold text-[#7f061d]">
                                Saving...
                            </div>
                        )}
                        {saveStatus === "saved" && (
                            <div className="px-4 py-2 text-sm font-bold text-green-700">
                                ✓ Saved
                            </div>
                        )}

                        {/* Manual Save Button */}
                        <button
                            onClick={handleManualSave}
                            disabled={isSaving}
                            className="rounded-[1.2rem] border-3 border-[#7f061d] bg-[#b10f2e] px-6 py-2 font-bold text-white transition duration-200 hover:-translate-y-1 hover:bg-[#ca1a3a] hover:shadow-[0_10px_0_0_rgba(87,0,0,0.2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe5c9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7d9bd] active:translate-y-1 active:shadow-[0_4px_0_0_rgba(87,0,0,0.2)] shadow-[0_8px_0_0_rgba(87,0,0,0.2)] disabled:opacity-50"
                        >
                            Save Quiz
                        </button>
                    </div>
                </div>

                {/* Quiz Name Input */}
                <div className="mb-8">
                    <input
                        type="text"
                        value={quiz.name}
                        onChange={(e) => handleQuizNameChange(e.target.value)}
                        className="w-full border-b-4 border-[#7f061d] bg-transparent px-2 py-3 font-[family:var(--font-display)] text-4xl text-[#b10f2e] placeholder-[#7f061d]/40 outline-none focus:border-[#b10f2e]"
                        placeholder="Quiz Name"
                    />
                </div>

                {/* Main Content */}
                <div className="grid w-full gap-8 lg:grid-cols-4">
                    {/* Left Sidebar - Question List */}
                    <div className="lg:col-span-1">
                        <div className="rounded-[2rem] border-4 border-[#7f061d] bg-[#b10f2e] p-6 shadow-[0_12px_0_0_rgba(87,0,0,0.2)]">
                            <h2 className="mb-6 font-[family:var(--font-display)] text-2xl tracking-[0.06em] text-white">
                                Questions
                            </h2>

                            {/* Question List */}
                            <div className="mb-6 max-h-96 space-y-2 overflow-y-auto">
                                {quiz.questions.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedQuestionIndex(index)}
                                        className={`w-full rounded-[1rem] px-4 py-3 text-left transition duration-150 ${selectedQuestionIndex === index
                                            ? "bg-white text-[#b10f2e]"
                                            : "bg-[#8d0f26] text-white hover:bg-[#a91229]"
                                            }`}
                                    >
                                        <p className="text-xs opacity-75">Question {index + 1}</p>
                                        <p className="truncate text-sm font-bold">
                                            {quiz.questions[index].question}
                                        </p>
                                    </button>
                                ))}
                            </div>

                            {/* Add Question Button */}
                            <button
                                onClick={handleAddQuestion}
                                className="w-full rounded-[1rem] border-2 border-white bg-transparent px-4 py-3 font-bold text-white transition duration-150 hover:bg-white/10"
                            >
                                + Add Question
                            </button>
                        </div>
                    </div>

                    {/* Right Content - Question Editor */}
                    <div className="lg:col-span-3">
                        {currentQuestion ? (
                            <div className="space-y-6">
                                {/* Question Input */}
                                <div className="rounded-[2rem] border-4 border-[#7f061d] bg-white p-8 shadow-[0_12px_0_0_rgba(87,0,0,0.2)]">
                                    <label className="mb-3 block font-bold text-[#7f061d]">
                                        Question
                                    </label>
                                    <textarea
                                        value={currentQuestion.question}
                                        onChange={(e) =>
                                            handleQuestionChange("question", e.target.value)
                                        }
                                        className="w-full rounded-[1rem] border-2 border-[#7f061d]/30 bg-[#f7d9bd]/20 px-4 py-3 outline-none transition focus:border-[#7f061d]"
                                        rows={3}
                                        placeholder="Enter question"
                                    />
                                </div>

                                {/* Answers Grid */}
                                <div>
                                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                                        {currentQuestion.answers.map((answer, answerIndex) => {
                                            const answerColor = getAnswerColor(answerIndex);
                                            const answerLabel = getAnswerLabel(answerIndex);
                                            return (
                                                <div
                                                    key={answerIndex}
                                                    className="rounded-[1.6rem] border-4 bg-white p-6 shadow-[0_10px_0_0_rgba(87,0,0,0.12)]"
                                                    style={{
                                                        borderColor: answerColor,
                                                    }}
                                                >
                                                    <div className="mb-4 flex items-start gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={currentQuestion.correct.includes(
                                                                answerIndex
                                                            )}
                                                            onChange={() =>
                                                                handleCorrectAnswerToggle(answerIndex)
                                                            }
                                                            className="mt-1 h-5 w-5 cursor-pointer accent-green-600"
                                                        />
                                                        <label className="flex-1 font-bold text-[#7f061d]">
                                                            {answerLabel}
                                                        </label>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={answer}
                                                        onChange={(e) =>
                                                            handleAnswerChange(answerIndex, e.target.value)
                                                        }
                                                        className="w-full rounded-[0.8rem] border-2 border-[#7f061d]/20 bg-[#f7d9bd]/10 px-3 py-2 text-sm outline-none transition focus:border-[#7f061d]"
                                                        placeholder="Enter answer"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Delete Question Button */}
                                <button
                                    onClick={() => {
                                        if (selectedQuestionIndex !== null) {
                                            handleDeleteQuestion(selectedQuestionIndex);
                                        }
                                    }}
                                    className="w-full rounded-[1rem] border-3 border-red-600 bg-red-100 px-4 py-3 font-bold text-red-700 transition duration-150 hover:bg-red-200"
                                >
                                    Delete Question
                                </button>

                                {/* Create Questions with AI Button */}
                                <button
                                    onClick={() => setAIModalState("open")}
                                    className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-[2rem] border-4 border-[#7f061d] bg-black px-8 py-4 text-center shadow-[0_12px_0_0_#2a2a2a] transition duration-200 ease-out hover:-translate-y-1 hover:bg-gray-900 hover:shadow-[0_16px_0_0_#2a2a2a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe5c9] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7d9bd] active:translate-y-2 active:shadow-[0_6px_0_0_#2a2a2a]"
                                >
                                    <span className="absolute inset-x-5 top-2 h-4 rounded-full bg-white/20 blur-md transition duration-200 group-hover:bg-white/30" />
                                    <span className="font-[family:var(--font-display)] text-xl tracking-[0.06em] text-white">
                                        Create Questions with AI
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <div className="rounded-[2rem] border-4 border-[#7f061d] bg-white p-12 text-center shadow-[0_12px_0_0_rgba(87,0,0,0.2)]">
                                <p className="mb-6 text-xl text-[#5c0a14]/80">
                                    No questions yet. Add your first question to get started!
                                </p>
                                <button
                                    onClick={handleAddQuestion}
                                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-[2rem] border-4 border-[#7f061d] bg-[#b10f2e] px-8 py-4 text-center shadow-[0_12px_0_0_#570000] transition duration-200 ease-out hover:-translate-y-1 hover:bg-[#ca1a3a] hover:shadow-[0_16px_0_0_#570000] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe5c9] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7d9bd] active:translate-y-2 active:shadow-[0_6px_0_0_#570000]"
                                >
                                    <span className="font-[family:var(--font-display)] text-xl tracking-[0.06em] text-white">
                                        Add First Question
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Prompt Modal */}
            {aiModalState !== "closed" && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-6 py-12">
                    <div className="w-full max-w-md rounded-[2rem] border-4 border-[#7f061d] bg-white p-8 shadow-2xl">
                        {aiModalState === "loading" && (
                            <div className="text-center">
                                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#7f061d] border-t-[#b10f2e]" />
                                <p className="font-bold text-[#7f061d]">
                                    AI is creating questions...
                                </p>
                            </div>
                        )}

                        {aiModalState === "success" && (
                            <div className="text-center">
                                <p className="mb-4 text-4xl">✓</p>
                                <p className="font-bold text-green-700">
                                    Questions created successfully!
                                </p>
                            </div>
                        )}

                        {aiModalState === "error" && (
                            <div className="text-center">
                                <p className="mb-4 font-bold text-red-700">{aiError}</p>
                                <button
                                    onClick={() => setAIModalState("open")}
                                    className="rounded-[1rem] border-2 border-[#7f061d] bg-[#f7d9bd] px-4 py-2 font-bold text-[#7f061d] transition hover:bg-[#ffe7d3]"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {aiModalState === "open" && (
                            <div className="space-y-6">
                                <h2 className="font-[family:var(--font-display)] text-2xl text-[#b10f2e]">
                                    Create Questions with AI
                                </h2>

                                <textarea
                                    value={aiPrompt}
                                    onChange={(e) => {
                                        setAIPrompt(e.target.value);
                                        setAIError(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" &&
                                            e.ctrlKey &&
                                            aiModalState === "open"
                                        ) {
                                            handleAIPromptSubmit();
                                        }
                                    }}
                                    placeholder="Enter a prompt to generate questions (e.g., 'World War 2')"
                                    className="w-full rounded-[1rem] border-2 border-[#7f061d]/30 bg-[#f7d9bd]/20 px-4 py-3 outline-none transition focus:border-[#7f061d]"
                                    rows={5}
                                />

                                <div className="space-y-2">
                                    <label className="block font-bold text-[#7f061d]">
                                        Number of Questions
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={aiQuestionCount}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (value >= 1 && value <= 20) {
                                                setAiQuestionCount(value);
                                            }
                                        }}
                                        className="w-full rounded-[1rem] border-2 border-[#7f061d]/30 bg-[#f7d9bd]/20 px-4 py-3 outline-none transition focus:border-[#7f061d]"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setAIModalState("closed")}
                                        className="flex-1 rounded-[1rem] border-2 border-[#7f061d] bg-[#f7d9bd] px-4 py-2 font-bold text-[#7f061d] transition hover:bg-[#ffe7d3]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAIPromptSubmit}
                                        disabled={aiModalState !== "open"}
                                        className="flex-1 rounded-[1rem] border-2 border-[#7f061d] bg-[#b10f2e] px-4 py-2 font-bold text-white transition hover:bg-[#ca1a3a] disabled:opacity-50"
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}

// Helper function to calculate answer color
const getAnswerColor = (index: number): string => {
    const colors = ["#ff4444", "#4499ff", "#44cc44", "#ffcc00"];
    return colors[index % colors.length];
};

// Helper function to get answer label
const getAnswerLabel = (index: number): string => {
    const labels = ["Answer 1", "Answer 2", "Answer 3", "Answer 4"];
    return labels[index] || `Answer ${index + 1}`;
};
