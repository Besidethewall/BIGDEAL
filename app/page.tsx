"use client";

import { useEffect, useMemo, useState } from "react";
import GameSwitcher from "./components/GameSwitcher";

type Game = {
  id: number;
  name: string;
  slug: string;
};

type Article = {
  id: number;
  gameId: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedGame, setSelectedGame] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomepage() {
      try {
        const [gamesResponse, articlesResponse] = await Promise.all([
          fetch("/api/games"),
          fetch("/api/articles"),
        ]);

        if (!gamesResponse.ok) {
          throw new Error("Failed to load games.");
        }

        if (!articlesResponse.ok) {
          throw new Error("Failed to load articles.");
        }

        const gamesData: Game[] = await gamesResponse.json();
        const articlesData: Article[] = await articlesResponse.json();

        setGames(gamesData);
        setArticles(articlesData);
      } catch (error) {
        console.error("Homepage failed:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHomepage();
  }, []);

  const filteredArticles = useMemo(() => {
    if (selectedGame === "all") {
      return articles;
    }

    const selected = games.find(
      (game) => game.slug === selectedGame
    );

    if (!selected) {
      return [];
    }

    return articles.filter(
      (article) => article.gameId === selected.id
    );
  }, [articles, games, selectedGame]);

  const featuredArticle = filteredArticles[0];
  const latestArticles = filteredArticles.slice(1);

  function getGameName(gameId: number) {
    return (
      games.find((game) => game.id === gameId)?.name ??
      "BIGDEAL"
    );
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
      {/* HEADER */}
      <header className="border-b border-[#CBC9C0]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="flex items-center justify-between py-6">
            <a href="/" className="block">
              <div className="text-3xl font-black tracking-[-0.05em]">
                BIGDEAL
              </div>

              <div className="mt-1 text-[9px] font-semibold tracking-[0.24em] text-[#4B4A47]">
                MMORPG NEWS & INTELLIGENCE
              </div>
            </a>

            <div className="flex items-center gap-6">
              <a
                href="/news"
                className="text-[10px] font-bold tracking-[0.16em] text-[#1F1D1A] transition hover:text-[#B88A3B]"
              >
                NEWS
              </a>

              <a
                href="/search"
                className="text-[10px] font-bold tracking-[0.16em] text-[#1F1D1A] transition hover:text-[#B88A3B]"
              >
                SEARCH
              </a>

              <a
                href="/admin"
                className="text-[10px] font-bold tracking-[0.16em] text-[#4B4A47] transition hover:text-[#B88A3B]"
              >
                ADMIN
              </a>
            </div>
          </div>

          <nav className="border-t border-[#CBC9C0]">
            <div className="flex items-center gap-7 overflow-x-auto py-4">
              <a
                href="/news"
                className="whitespace-nowrap text-[10px] font-bold tracking-[0.16em] hover:text-[#B88A3B]"
              >
                NEWS
              </a>

              <a
                href="/category/patch-notes"
                className="whitespace-nowrap text-[10px] font-bold tracking-[0.16em] hover:text-[#B88A3B]"
              >
                PATCHES
              </a>

              <a
                href="/category/classes"
                className="whitespace-nowrap text-[10px] font-bold tracking-[0.16em] hover:text-[#B88A3B]"
              >
                CLASSES
              </a>

              <a
                href="/category/pve"
                className="whitespace-nowrap text-[10px] font-bold tracking-[0.16em] hover:text-[#B88A3B]"
              >
                PVE
              </a>

              <a
                href="/category/pvp"
                className="whitespace-nowrap text-[10px] font-bold tracking-[0.16em] hover:text-[#B88A3B]"
              >
                PVP
              </a>

              <a
                href="/category/lore"
                className="whitespace-nowrap text-[10px] font-bold tracking-[0.16em] hover:text-[#B88A3B]"
              >
                LORE
              </a>

              <a
                href="/category/economy"
                className="whitespace-nowrap text-[10px] font-bold tracking-[0.16em] hover:text-[#B88A3B]"
              >
                ECONOMY
              </a>

              <a
                href="/category/community"
                className="whitespace-nowrap text-[10px] font-bold tracking-[0.16em] hover:text-[#B88A3B]"
              >
                COMMUNITY
              </a>

              <a
                href="/research"
                className="whitespace-nowrap text-[10px] font-bold tracking-[0.16em] hover:text-[#B88A3B]"
              >
                RESEARCH
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* GAME SWITCHER */}
      <section className="border-b border-[#CBC9C0]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <GameSwitcher
            selectedGame={selectedGame}
            onGameChange={setSelectedGame}
          />
        </div>
      </section>

      {/* MAIN */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* HERO */}
        <section className="border-b border-[#CBC9C0] py-10 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.7fr_0.8fr]">
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                BIGDEAL / THE NEWS
              </div>

              <h1 className="mt-5 max-w-5xl font-serif text-5xl leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
                MMORPG news,
                <br />
                context & intelligence.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-[#4B4A47]">
                Independent reporting, research and analysis across the
                games shaping the MMORPG landscape.
              </p>
            </div>

            <div className="border-l border-[#CBC9C0] pl-7 lg:pl-10">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                COVERAGE
              </div>

              <div className="mt-6 space-y-5">
                {games.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => setSelectedGame(game.slug)}
                    className="block w-full border-b border-[#CBC9C0] pb-5 text-left transition hover:text-[#B88A3B]"
                  >
                    <div className="font-serif text-2xl tracking-[-0.02em]">
                      {game.name}
                    </div>

                    <div className="mt-2 text-[9px] font-bold tracking-[0.14em] text-[#4B4A47]">
                      VIEW COVERAGE →
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED STORY */}
        <section className="border-b border-[#CBC9C0] py-10 lg:py-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                FEATURED STORY
              </div>

              <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em]">
                Latest intelligence
              </h2>
            </div>

            <div className="text-[9px] font-bold tracking-[0.16em] text-[#4B4A47]">
              {selectedGame === "all"
                ? "ALL GAMES"
                : selectedGame.toUpperCase()}
            </div>
          </div>

          {loading ? (
            <div className="border border-[#CBC9C0] px-6 py-12 text-sm text-[#4B4A47]">
              Loading stories...
            </div>
          ) : !featuredArticle ? (
            <div className="border border-[#CBC9C0] px-6 py-12 text-sm text-[#4B4A47]">
              No stories available for this game.
            </div>
          ) : (
            <a
              href={`/news/${featuredArticle.slug}`}
              className="group block border border-[#CBC9C0] p-7 transition hover:border-[#1F1D1A] lg:p-10"
            >
              <div className="grid gap-10 lg:grid-cols-[1.5fr_0.7fr]">
                <div>
                  <div className="text-[9px] font-bold tracking-[0.18em] text-[#B88A3B]">
                    {getGameName(featuredArticle.gameId)}{" "}
                    / {featuredArticle.status}
                  </div>

                  <h3 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.05] tracking-[-0.04em] transition group-hover:text-[#B88A3B] sm:text-5xl lg:text-6xl">
                    {featuredArticle.title}
                  </h3>

                  {featuredArticle.excerpt && (
                    <p className="mt-6 max-w-3xl text-base leading-8 text-[#4B4A47]">
                      {featuredArticle.excerpt}
                    </p>
                  )}

                  <div className="mt-8 flex items-center gap-5">
                    <span className="text-[10px] font-bold tracking-[0.16em]">
                      READ STORY
                    </span>

                    <span className="text-[#B88A3B]">→</span>
                  </div>
                </div>

                <div className="border-l border-[#CBC9C0] pl-7 lg:pl-10">
                  <div className="text-[9px] font-bold tracking-[0.16em] text-[#4B4A47]">
                    PUBLISHED
                  </div>

                  <div className="mt-3 font-serif text-2xl">
                    {formatDate(featuredArticle.createdAt)}
                  </div>

                  <div className="mt-8 text-[9px] font-bold tracking-[0.16em] text-[#4B4A47]">
                    FORMAT
                  </div>

                  <div className="mt-3 text-sm leading-6">
                    Original editorial coverage with context,
                    research and source-based analysis.
                  </div>
                </div>
              </div>
            </a>
          )}
        </section>

        {/* LATEST STORIES */}
        <section className="border-b border-[#CBC9C0] py-10 lg:py-14">
          <div className="flex items-end justify-between border-b border-[#CBC9C0] pb-5">
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                THE NEWS
              </div>

              <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em]">
                Latest stories
              </h2>
            </div>

            <div className="text-[9px] font-bold tracking-[0.16em] text-[#4B4A47]">
              {filteredArticles.length} STORIES
            </div>
          </div>

          <div className="divide-y divide-[#CBC9C0]">
            {latestArticles.length === 0 ? (
              <div className="py-10 text-sm text-[#4B4A47]">
                No additional stories available.
              </div>
            ) : (
              latestArticles.map((article) => (
                <a
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group grid gap-6 py-8 transition hover:bg-[#ECE9D2]/40 lg:grid-cols-[150px_1fr_180px]"
                >
                  <div>
                    <div className="text-[9px] font-bold tracking-[0.16em] text-[#B88A3B]">
                      {getGameName(article.gameId)}
                    </div>

                    <div className="mt-3 text-[9px] tracking-[0.1em] text-[#4B4A47]">
                      {formatDate(article.createdAt)}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl leading-tight tracking-[-0.02em] transition group-hover:text-[#B88A3B]">
                      {article.title}
                    </h3>

                    {article.excerpt && (
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#4B4A47]">
                        {article.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center lg:justify-end">
                    <span className="text-[9px] font-bold tracking-[0.16em]">
                      READ →
                    </span>
                  </div>
                </a>
              ))
            )}
          </div>
        </section>

        {/* EDITORIAL PILLARS */}
        <section className="border-b border-[#CBC9C0] py-10 lg:py-14">
          <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
            EDITORIAL PILLARS
          </div>

          <div className="mt-8 grid divide-y divide-[#CBC9C0] border border-[#CBC9C0] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {[
              {
                title: "PATCHES",
                description:
                  "What changed, what matters and what players should know.",
              },
              {
                title: "CLASSES",
                description:
                  "Class changes, builds, balance and the data behind them.",
              },
              {
                title: "COMMUNITY",
                description:
                  "Player reactions, discussions and emerging community trends.",
              },
              {
                title: "RESEARCH",
                description:
                  "Deep investigations built from multiple sources and evidence.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 lg:p-7"
              >
                <div className="text-[10px] font-bold tracking-[0.18em] text-[#B88A3B]">
                  {item.title}
                </div>

                <p className="mt-4 text-sm leading-7 text-[#4B4A47]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-5 px-6 py-10 sm:flex-row lg:px-10">
          <div>
            <div className="text-2xl font-black tracking-[-0.04em]">
              BIGDEAL
            </div>

            <div className="mt-2 text-[9px] font-semibold tracking-[0.2em] text-[#4B4A47]">
              MMORPG NEWS & INTELLIGENCE
            </div>
          </div>

          <div className="text-[9px] leading-6 tracking-[0.08em] text-[#4B4A47] sm:text-right">
            Independent editorial coverage.
            <br />
            Research before publication.
          </div>
        </div>
      </footer>
    </main>
  );
}