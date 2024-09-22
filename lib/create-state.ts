import { GameState } from "../types/game";
import { Item } from "../types/item";
import { getRandomItem, preloadImage } from "./items";

export default async function createState(deck: Item[]): Promise<GameState> {
    const playedIds = new Set<string>();
    console.log('createState!');
    // Start by adding the first card's ID to playedIds
    const firstItem = getRandomItem(deck, [], playedIds);
    playedIds.add(firstItem.id);
    console.log("cs - playedIds:", playedIds);

    const played = [{ ...firstItem, played: { correct: true } }];
    const next = getRandomItem(deck, played, playedIds);
    playedIds.add(next.id);
    console.log("cs2 - playedIds:", playedIds);
    const nextButOne = getRandomItem(deck, [...played, next], playedIds);
    playedIds.add(nextButOne.id);
    const imageCache = [preloadImage(next.image), preloadImage(nextButOne.image)];

    return {
        badlyPlaced: null,
        deck: shuffleArray(deck), // Initially shuffle the deck
        imageCache,
        lives: 3,
        next,
        nextButOne,
        played,
        playedIds
    };
}

function shuffleArray<T>(array: Array<T>): Array<T> {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
    return array;
}