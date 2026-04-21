import type { GameAPI } from "./types";
import { game as classicGame } from "./classic/game";

export type Games = "classic"
export type GameData = {
    name: string;
    description: string;
    game: GameAPI;
}

export const games: Record<Games, GameData> = {
    classic: {
        name: "Classic Quiz",
        description: "Test your knowledge with our classic trivia format.",
        game: classicGame,
    }
};