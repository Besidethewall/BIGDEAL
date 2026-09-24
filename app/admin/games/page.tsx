"use client";

import { useEffect, useState } from "react";

type Game = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGames() {
      try {
        const response = await fetch("/api/admin/games");

        if (!response.ok) {
          throw new Error("Failed to load games.");
        }

        const data: Game[] = await response.json();

        setGames(data);
      } catch (error) {
        console.error("Admin games failed:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load games."
        );
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
      <header className="border-b border-[#CBC9C0]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 lg:px-10">
          <a href="/admin" className="block">
            <div className="text-3xl font-black tracking-[-0.05em]">
              BIGDEAL
            </div>

            <div className="mt-1 text-[9px] font-semibold tracking-[0.24em] text-[#4B4A47]">
              EDITORIAL SYSTEM
            </div>
          </a>

          <div className="flex items-center gap-6">
            <a
              href="/"
              className="text-[10px] font-bold tracking-[0.16em] text-[#4B4A47] transition hover:text-[#B88A3B]"
            >
              VIEW SITE
            </a>

            <a
              href="/admin"
              className="text-[10px] font-bold tracking-[0.16em] text-[#B88A3B]"
            >
              DASHBOARD
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
        <div className="flex flex-col justify-between gap-6 border-b border-[#CBC9C0] pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
              ADMIN / GAMES
            </div>

            <h1 className="mt-3 font-serif text-5xl tracking-[-0.04em]">
              Games
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4B4A47]">
              Manage the games covered by the BIGDEAL editorial system.
            </p>
          </div>

          <a
            href="/admin/games/new"
            className="inline-block border border-[#1F1D1A] px-6 py-4 text-[10px] font-bold tracking-[0.16em] transition hover:bg-[#1F1D1A] hover:text-[#FFFAEB]"
          >
            ADD GAME
          </a>
        </div>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between border-b border-[#CBC9C0] pb-4">
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                GAME DATABASE
              </div>

              <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em]">
                All games
              </h2>
            </div>

            <div className="text-[9px] font-bold tracking-[0.16em] text-[#4B4A47]">
              {loading ? "LOADING" : `${games.length} GAMES`}
            </div>
          </div>

          {loading ? (
            <div className="border border-[#CBC9C0] px-6 py-12 text-sm text-[#4B4A47]">
              Loading games...
            </div>
          ) : error ? (
            <div className="border border-[#B88A3B] bg-[#ECE9D2] px-6 py-12 text-sm text-[#1F1D1A]">
              {error}
            </div>
          ) : games.length === 0 ? (
            <div className="border border-[#CBC9C0] px-6 py-12 text-sm text-[#4B4A47]">
              No games found.
            </div>
          ) : (
            <div className="border border-[#CBC9C0]">
              {games.map((game, index) => (
                <article
                  key={game.id}
                  className={`px-6 py-7 ${
                    index !== 0 ? "border-t border-[#CBC9C0]" : ""
                  }`}
                >
                  <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-bold tracking-[0.18em] text-[#B88A3B]">
                        GAME #{game.id}
                      </div>

                      <h3 className="mt-2 font-serif text-2xl leading-tight tracking-[-0.02em]">
                        {game.name}
                      </h3>

                      <div className="mt-3 text-[10px] tracking-[0.08em] text-[#4B4A47]">
                        /{game.slug}
                      </div>

                      {game.description && (
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4B4A47]">
                          {game.description}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-col gap-5 sm:flex-row sm:items-center">
                      <div>
                        <div className="text-[9px] font-bold tracking-[0.16em] text-[#4B4A47]">
                          STATUS
                        </div>

                        <div
                          className={`mt-2 text-[10px] font-bold tracking-[0.12em] ${
                            game.isActive
                              ? "text-[#3A6D78]"
                              : "text-[#4B4A47]"
                          }`}
                        >
                          {game.isActive ? "ACTIVE" : "INACTIVE"}
                        </div>
                      </div>

                      <div>
                        <div className="text-[9px] font-bold tracking-[0.16em] text-[#4B4A47]">
                          CREATED
                        </div>

                        <div className="mt-2 text-[10px] tracking-[0.08em]">
                          {formatDate(game.createdAt)}
                        </div>
                      </div>

                      <a
                        href={`/admin/games/${game.id}`}
                        className="inline-block cursor-pointer border-b-2 border-[#B88A3B] pb-1 text-[10px] font-bold tracking-[0.14em] text-[#B88A3B] transition hover:border-[#1F1D1A] hover:text-[#1F1D1A]"
                      >
                        EDIT
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}