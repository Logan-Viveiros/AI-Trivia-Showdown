import { GameAPI } from "../types";

function updateState(state: any, stuff: any): any {
    return { ...state, ...stuff }
}

export const game: GameAPI = {
    name: "Classic",

    initialize(config) {
        return {
            score: 0,
            gameOver: false,
            requestQuestion: true,
        };
    },

    onCorrectAnswer(state) {
        const newScore = state.score + 1;
        return updateState(state, {
            score: newScore,
            requestQuestion: true
        });
    },

    onWrongAnswer(state) {
        return updateState(state, {
            requestQuestion: true
        });
    },

    render(state) {
        return (
            <div>
                <h1>Score: {state.score}</h1>
            </div>
        );
    },
}