import type { Quiz } from "./quiz";

export const demoQuiz: Quiz = {
    id: "demo-general",
    name: "General Knowledge",
    questions: [
        {
            question: "What is the largest planet in our solar system?",
            answers: ["Jupiter", "Saturn", "Earth", "Mars"],
            correct: [0],
        },
        {
            question: "In what year did the Titanic sink?",
            answers: ["1920", "1905", "1912", "1898"],
            correct: [2],
        },
        {
            question: "Who painted the Mona Lisa?",
            answers: ["Michelangelo", "Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci"],
            correct: [3],
        },
    ],
};
