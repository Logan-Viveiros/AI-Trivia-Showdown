import { Question } from "@/quizzes/quiz";
import { JSX } from "react/jsx-runtime";

export type GameConfig = {
    endCondition: "time" | "score";
    endValue: number;
}

export type GameState = {
    score: number;
    gameOver: boolean;

    requestQuestion?: boolean;
    isQuestionActive?: boolean;

    // each game can extend this
    [key: string]: any;
};

export type GameAPI = {
    name: string;

    // Setup
    initialize: (config: GameConfig) => GameState;

    // Called every frame or tick
    update?: (state: GameState) => GameState;

    // When player answers correctly
    onCorrectAnswer: (state: GameState) => GameState;

    // When player answers incorrectly
    onWrongAnswer: (state: GameState) => GameState;

    // Check if game is over (not score or time based, but other conditions)
    isGameOver?: (state: GameState) => boolean;

    // Game render
    render: (state: GameState) => JSX.Element;

    // Optional custom question render (for games that want to render questions differently)
    questionRender?: (state: GameState, question: Question) => JSX.Element;
};