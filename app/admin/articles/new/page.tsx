"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Game = {
  id: number;
  name: string;
  slug: string;
};

export default function NewArticlePage() {
  const router = useRouter();

  const [games, setGames] = useState<Game[]>([]);
  const [gameId, setGameId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [loadingGames, setLoadingGames] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGames() {
      try {
        const response = await fetch("/api/games");

        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }

        const data: Game[] = await response.json();

        setGames(data);

        if (data.length > 0) {
          setGameId(String(data[0].id));
        }
      } catch (error) {
        console.error("New article games failed:", error);
        setError("Unable to load games.");
      } finally {
        setLoadingGames(false);
      }
    }

    loadGames();
  }, []);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug || slug === createSlug(title)) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!gameId || !title.trim() || !slug.trim() || !content.trim()) {
      setError("Game, title, slug and content are required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: Number(gameId),
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create article.");
      }

      router.push(`/admin/articles/${data.id}`);
    } catch (error) {
      console.error("Create article failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create article."
      );
    } finally {
      setSaving(false);
    }
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
              href="/admin/articles"
              className="text-[10px] font-bold tracking-[0.16em] text-[#4B4A47] transition hover:text-[#B88A3B]"
            >
              ARTICLES
            </Link>

            <Link
              href="/"
              className="text-[10px] font-bold tracking-[0.16em] text-[#4B4A47] transition hover:text-[#B88A3B]"
            >
              VIEW SITE
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-6 py-10 lg:px-10 lg:py-14">
        <div className="border-b border-[#CBC9C0] pb-8">
          <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
            ADMIN / ARTICLES / NEW
          </div>

          <h1 className="mt-3 font-serif text-5xl tracking-[-0.04em]">
            New Article
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4B4A47]">
            Create a new story and save it as a draft for editorial review.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10">
          {error && (
            <div className="mb-8 border border-[#B88A3B] bg-[#ECE9D2] px-5 py-4 text-sm leading-6 text-[#1F1D1A]">
              {error}
            </div>
          )}

          <div className="space-y-10">
            <section className="border-b border-[#CBC9C0] pb-10">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                STORY INFORMATION
              </div>

              <div className="mt-6 space-y-7">
                <div>
                  <label
                    htmlFor="game"
                    className="text-[10px] font-bold tracking-[0.16em]"
                  >
                    GAME
                  </label>

                  <select
                    id="game"
                    value={gameId}
                    onChange={(event) => setGameId(event.target.value)}
                    disabled={loadingGames}
                    className="mt-3 w-full border border-[#CBC9C0] bg-transparent px-4 py-4 text-sm outline-none focus:border-[#1F1D1A]"
                  >
                    {loadingGames ? (
                      <option value="">Loading games...</option>
                    ) : (
                      games.map((game) => (
                        <option key={game.id} value={game.id}>
                          {game.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="title"
                    className="text-[10px] font-bold tracking-[0.16em]"
                  >
                    TITLE
                  </label>

                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(event) =>
                      handleTitleChange(event.target.value)
                    }
                    placeholder="Enter article title"
                    className="mt-3 w-full border-b border-[#CBC9C0] bg-transparent py-4 font-serif text-3xl outline-none placeholder:text-[#9A9891] focus:border-[#1F1D1A]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="slug"
                    className="text-[10px] font-bold tracking-[0.16em]"
                  >
                    SLUG
                  </label>

                  <input
                    id="slug"
                    type="text"
                    value={slug}
                    onChange={(event) => setSlug(createSlug(event.target.value))}
                    placeholder="article-url-slug"
                    className="mt-3 w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none placeholder:text-[#9A9891] focus:border-[#1F1D1A]"
                  />

                  <p className="mt-2 text-[10px] tracking-[0.08em] text-[#4B4A47]">
                    /news/{slug || "article-url-slug"}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="excerpt"
                    className="text-[10px] font-bold tracking-[0.16em]"
                  >
                    EXCERPT
                  </label>

                  <textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    placeholder="Short summary of the story"
                    rows={4}
                    className="mt-3 w-full resize-none border border-[#CBC9C0] bg-transparent px-4 py-4 text-sm leading-7 outline-none placeholder:text-[#9A9891] focus:border-[#1F1D1A]"
                  />
                </div>
              </div>
            </section>

            <section className="border-b border-[#CBC9C0] pb-10">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                STORY CONTENT
              </div>

              <div className="mt-6">
                <label
                  htmlFor="content"
                  className="text-[10px] font-bold tracking-[0.16em]"
                >
                  CONTENT
                </label>

                <textarea
                  id="content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Write the article content..."
                  rows={18}
                  className="mt-3 w-full resize-y border border-[#CBC9C0] bg-transparent px-5 py-5 text-base leading-8 outline-none placeholder:text-[#9A9891] focus:border-[#1F1D1A]"
                />
              </div>
            </section>

            <section>
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                    WORKFLOW
                  </div>

                  <div className="mt-2 text-sm text-[#4B4A47]">
                    New articles are saved as DRAFT.
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    href="/admin/articles"
                    className="border border-[#CBC9C0] px-6 py-4 text-[10px] font-bold tracking-[0.16em] transition hover:border-[#1F1D1A]"
                  >
                    CANCEL
                  </Link>

                  <button
                    type="submit"
                    disabled={saving || loadingGames}
                    className="border border-[#1F1D1A] bg-[#1F1D1A] px-7 py-4 text-[10px] font-bold tracking-[0.16em] text-[#FFFAEB] transition hover:bg-[#B88A3B] hover:border-[#B88A3B] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "SAVING..." : "SAVE DRAFT"}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>
    </main>
  );
}