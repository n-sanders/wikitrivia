import { Item, PlayedItem } from "../types/item";
import { createWikimediaImage } from "./image";

export function getRandomItem(deck: Item[], played: Item[], playedIds: Set<string>): Item {
  // Filter out items that have already been played
  console.log("gri - playedIds:", playedIds);
  const availableItems = deck.filter(item => !playedIds.has(item.id));

  if (availableItems.length === 0) {
    console.log("Out of cards, setting next card as a YOU WIN!");

    // Create a fake 'YOU WIN!' Item
    return {
        date_prop_id: "P571", // Using P571 for 'created' as a placeholder since it's a win condition, not a real date property
        description: "Congratulations! You've won the game!",
        id: "you-win-id",
        label: "You win!",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Russian_Cup_Trophy.png/640px-Russian_Cup_Trophy.png", // You might want to specify an image path here
        year: 2024, // or any arbitrary year, or -1 to signify it's not a real year
    };
}

  // If after shuffling/resetting we still have no items (which shouldn't happen but for safety)
  if (availableItems.length === 0) {
      console.error("Unexpectedly ran out of items after shuffling/reset.");
      return deck[0]; // Fallback to the first item in the deck
  }

  const item = availableItems[Math.floor(Math.random() * availableItems.length)];
  console.log("gri - picked, adding:", item.id);
  playedIds.add(item.id);
  return item;
}

export function checkCorrect(
  played: PlayedItem[],
  item: Item,
  index: number
): { correct: boolean; delta: number } {
  const sorted = [...played, item].sort((a, b) => a.year - b.year);
  const correctIndex = sorted.findIndex((i) => {
    return i.id === item.id;
  });

  if (index !== correctIndex) {
    return { correct: false, delta: correctIndex - index };
  }

  return { correct: true, delta: 0 };
}

export function preloadImage(url: string): HTMLImageElement {
  const img = new Image();
  img.src = createWikimediaImage(url);
  return img;
}
