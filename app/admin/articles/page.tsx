"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function AdminArticlesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const [gamesResponse, articlesResponse] = await Promise.all([
          fetch("/api/games"),
          fetch("/api/articles"),
        ]);

        if (!gamesResponse.ok) {
          throw new Error("Failed to fetch games");
        }

        if (!articlesResponse.ok) {
          throw new Error("Failed to fetch articles");
        }

        const gamesData: Game[] = await gamesResponse.json();
        const articlesData: Article[] = await articlesResponse.json();

        setGames(gamesData);
        setArticles(articlesData);
      } catch (error) {
        console.error("Admin articles failed:", error);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  function getGameName(gameId: number) {
    return games.find((game) => game.id === gameId)?.name ?? "Unknown Game";
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
      <header className="border-b border-[#CBC9C0]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 lg:px-10">
          <Link href="/admin" className="block">
            <div className="text-3xl font-black tracking-[-0.05em]">
              BIGDEAL
            </div>

            <div className="mt-1 text-[9px] font-semibold tracking-[0.24em] text-[#4B4A47]">
              EDITORIAL SYSTEM
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[10px] font-bold tracking-[0.16em] text-[#4B4A47] transition hover:text-[#B88A3B]"
            >
              VIEW SITE
            </Link>

            <Link
              href="/admin"
              className="text-[10px] font-bold tracking-[0.16em] text-[#B88A3B]"
            >
              DASHBOARD
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
        <div className="flex flex-col justify-between gap-6 border-b border-[#CBC9C0] pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
              ADMIN / ARTICLES
            </div>

            <h1 className="mt-3 font-serif text-5xl tracking-[-0.04em]">
              Articles
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4B4A47]">
              Manage stories across every game published through the BIGDEAL
              editorial system.
            </p>
          </div>

          <Link
            href="/admin/articles/new"
            className="inline-block self-start border border-[#1F1D1A] px-6 py-4 text-[10px] font-bold tracking-[0.16em] transition hover:bg-[#1F1D1A] hover:text-[#FFFAEB] sm:self-auto"
          >
            NEW ARTICLE
          </Link>
        </div>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between border-b border-[#CBC9C0] pb-4">
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                CONTENT DATABASE
              </div>

              <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em]">
                All articles
              </h2>
            </div>

            <div className="text-[9px] font-bold tracking-[0.16em] text-[#4B4A47]">
              {loading ? "LOADING" : `${articles.length} ARTICLES`}
            </div>
          </div>

          {loading ? (
            <div className="border border-[#CBC9C0] px-6 py-12 text-sm text-[#4B4A47]">
              Loading articles...
            </div>
          ) : articles.length === 0 ? (
            <div className="border border-[#CBC9C0] px-6 py-12 text-sm text-[#4B4A47]">
              No articles found.
            </div>
          ) : (
            <div className="border border-[#CBC9C0]">
              {articles.map((article, index) => (
                <article
                  key={article.id}
                  className={`grid gap-6 px-6 py-7 lg:grid-cols-[1fr_180px_130px_120px] lg:items-center ${
                    index !== 0 ? "border-t border-[#CBC9C0]" : ""
                  }`}
                >
                  <div>
                    <div className="text-[9px] font-bold tracking-[0.18em] text-[#B88A3B]">
                      {getGameName(article.gameId)}
                    </div>

                    <h3 className="mt-2 max-w-3xl font-serif text-2xl leading-tight tracking-[-0.02em]">
                      {article.title}
                    </h3>

                    {article.excerpt && (
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4B4A47]">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="mt-4 text-[9px] tracking-[0.12em] text-[#4B4A47]">
                      /news/{article.slug}
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-bold tracking-[0.16em] text-[#4B4A47]">
                      STATUS
                    </div>

                    <div className="mt-2 text-[10px] font-bold tracking-[0.12em]">
                      {article.status}
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-bold tracking-[0.16em] text-[#4B4A47]">
                      CREATED
                    </div>

                    <div className="mt-2 text-[10px] tracking-[0.08em]">
                      {formatDate(article.createdAt)}
                    </div>
                  </div>

                  <div className="flex gap-4 lg:justify-end">
                    <Link
                      href={`/news/${article.slug}`}
                      className="border-b border-[#1F1D1A] pb-1 text-[9px] font-bold tracking-[0.14em] transition hover:border-[#B88A3B] hover:text-[#B88A3B]"
                    >
                      VIEW
                    </Link>

                    <span className="border-b border-[#CBC9C0] pb-1 text-[9px] font-bold tracking-[0.14em] text-[#9A9891]">
                      EDIT
                    </span>
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