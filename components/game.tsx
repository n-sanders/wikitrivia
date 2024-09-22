import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/router'; // Import useRouter
import { GameState } from "../types/game";
import { Item } from "../types/item";
import createState from "../lib/create-state";
import Board from "./board";
import Loading from "./loading";
import Instructions from "./instructions";
import badCards from "../lib/bad-cards";

export default function Game() {
  const router = useRouter();
  const { deck } = router.query; // Extract deck from URL params
  const [state, setState] = useState<GameState | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const res = await axios.get<string>(`/${deck || 'items'}.json`);
        const items: Item[] = res.data
          .trim()
          .split("\n")
          .map((line) => JSON.parse(line))
          .filter((item) => !(item.id in badCards));
        setItems(items);
      } catch (error) {
        console.error("Failed to fetch items:", error);
        // Handle error, maybe set state to show error message
      }
    };

    if (router.isReady) { // Ensure router has all info before fetching
      fetchGameData();
    }
  }, [deck, router.isReady]);

  useEffect(() => {
    (async () => {
      if (items !== null) {
        setState(await createState(items));
        setLoaded(true);
      }
    })();
  }, [items]);

  const resetGame = React.useCallback(() => {
    (async () => {
      if (items !== null) {
        setState(await createState(items));
      }
    })();
  }, [items]);

  const [highscore, setHighscore] = React.useState<number>(
    Number(localStorage.getItem("highscore") ?? "0")
  );

  const updateHighscore = React.useCallback((score: number) => {
    localStorage.setItem("highscore", String(score));
    setHighscore(score);
  }, []);

  if (!loaded || state === null) {
    return <Loading />;
  }

  if (!started) {
    return (
      <Instructions highscore={highscore} start={() => setStarted(true)} />
    );
  }

  return (
    <Board
      highscore={highscore}
      state={state}
      setState={setState}
      resetGame={resetGame}
      updateHighscore={updateHighscore}
    />
  );
}