"use client";

import { useEffect, useState } from "react";

type Game = {
  id: number;
  name: string;
  slug: string;
};

type GameSwitcherProps = {
  selectedGame: string;
  onGameChange: (slug: string) => void;
};

export default function GameSwitcher({
  selectedGame,
  onGameChange,
}: GameSwitcherProps) {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    async function loadGames() {
      try {
        const response = await fetch("/api/games");

        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.status}`);
        }

        const data: Game[] = await response.json();

        setGames(data);
      } catch (error) {
        console.error("GameSwitcher failed:", error);
      }
    }

    loadGames();
  }, []);

  return (
    <div className="flex items-center gap-6 overflow-x-auto py-4">
      <button
        type="button"
        onClick={() => onGameChange("all")}
        className={`whitespace-nowrap text-[11px] font-bold tracking-[0.16em] transition ${
          selectedGame === "all"
            ? "text-[#B88A3B]"
            : "text-[#1F1D1A] hover:text-[#B88A3B]"
        }`}
      >
        ALL GAMES
      </button>

      {games.map((game) => (
        <button
          key={game.id}
          type="button"
          onClick={() => onGameChange(game.slug)}
          className={`whitespace-nowrap text-[11px] font-bold tracking-[0.16em] transition ${
            selectedGame === game.slug
              ? "text-[#B88A3B]"
              : "text-[#1F1D1A] hover:text-[#B88A3B]"
        }`}
      >
        {game.name}
      </button>
      ))}
    </div>
  );
}