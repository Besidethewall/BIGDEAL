"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Game = {
  id: number;
  name: string;
};

export default function NewResearchProjectPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [gameId, setGameId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [researchQuestion, setResearchQuestion] = useState("");
  const [objective, setObjective] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/games")
      .then((response) => response.json())
      .then(setGames)
      .catch(() => setError("Failed to load games."));
  }, []);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!gameId || !title.trim() || !slug.trim()) {
      setError("Game, title, and slug are required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/research/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: Number(gameId),
          title: title.trim(),
          slug: slug.trim(),
          researchQuestion: researchQuestion.trim(),
          objective: objective.trim(),
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project.");
      }

      router.push("/admin/research/projects");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create project."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
      <header className="border-b border-[#CBC9C0]">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-6 lg:px-10">
          <Link href="/admin" className="block">
            <div className="text-3xl font-black tracking-[-0.05em]">BIGDEAL</div>
            <div className="mt-1 text-[9px] font-semibold tracking-[0.24em] text-[#4B4A47]">
              EDITORIAL SYSTEM
            </div>
          </Link>

          <Link
            href="/admin/research/projects"
            className="text-[10px] font-bold tracking-[0.16em] text-[#4B4A47] hover:text-[#B88A3B]"
          >
            RESEARCH PROJECTS
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-6 py-10 lg:px-10 lg:py-14">
        <div className="border-b border-[#CBC9C0] pb-8">
          <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
            ADMIN / RESEARCH / NEW
          </div>
          <h1 className="mt-3 font-serif text-5xl tracking-[-0.04em]">
            New Research Project
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          {error && (
            <div className="border border-[#B88A3B] bg-[#ECE9D2] px-5 py-4 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold tracking-[0.16em]">
              GAME
            </label>
            <select
              value={gameId}
              onChange={(event) => setGameId(event.target.value)}
              className="mt-3 w-full border-b border-[#CBC9C0] bg-transparent py-4 text-sm outline-none"
            >
              <option value="">Select a game</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-[0.16em]">
              TITLE
            </label>
            <input
              value={title}
              onChange={(event) => {
                const value = event.target.value;
                setTitle(value);
                if (!slug || slug === createSlug(title)) {
                  setSlug(createSlug(value));
                }
              }}
              className="mt-3 w-full border-b border-[#CBC9C0] bg-transparent py-4 font-serif text-3xl outline-none"
              placeholder="Research project title"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-[0.16em]">
              SLUG
            </label>
            <input
              value={slug}
              onChange={(event) => setSlug(createSlug(event.target.value))}
              className="mt-3 w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none"
              placeholder="research-project-slug"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-[0.16em]">
              RESEARCH QUESTION
            </label>
            <textarea
              value={researchQuestion}
              onChange={(event) => setResearchQuestion(event.target.value)}
              rows={4}
              className="mt-3 w-full resize-none border border-[#CBC9C0] bg-transparent px-4 py-4 text-sm leading-7 outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-[0.16em]">
              OBJECTIVE
            </label>
            <textarea
              value={objective}
              onChange={(event) => setObjective(event.target.value)}
              rows={4}
              className="mt-3 w-full resize-none border border-[#CBC9C0] bg-transparent px-4 py-4 text-sm leading-7 outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-[0.16em]">
              STATUS
            </label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-3 w-full border-b border-[#CBC9C0] bg-transparent py-4 text-sm outline-none"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          <div className="flex gap-4 border-t border-[#CBC9C0] pt-8">
            <Link
              href="/admin/research/projects"
              className="border border-[#CBC9C0] px-6 py-4 text-[10px] font-bold tracking-[0.16em] hover:border-[#1F1D1A]"
            >
              CANCEL
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="border border-[#1F1D1A] bg-[#1F1D1A] px-7 py-4 text-[10px] font-bold tracking-[0.16em] text-[#FFFAEB] hover:bg-[#B88A3B] disabled:opacity-50"
            >
              {saving ? "SAVING..." : "CREATE PROJECT"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
