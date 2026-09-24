"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Game = {
  id: number;
  name: string;
  slug: string;
};

export default function NewPatchPage() {
  const router = useRouter();

  const [games, setGames] = useState<Game[]>([]);
  const [gameId, setGameId] = useState("");
  const [version, setVersion] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const [loadingGames, setLoadingGames] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGames() {
      try {
        const response = await fetch(
          "/api/admin/games"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch games."
          );
        }

        const data: Game[] =
          await response.json();

        setGames(data);

        if (data.length > 0) {
          setGameId(String(data[0].id));
        }
      } catch (error) {
        console.error(
          "New patch games failed:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load games."
        );
      } finally {
        setLoadingGames(false);
      }
    }

    loadGames();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/patches",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId: Number(gameId),
            version,
            title,
            description,
            releaseDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to create patch."
        );
      }

      router.push("/admin/patches");
      router.refresh();
    } catch (error) {
      console.error(
        "Create patch failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create patch."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="border-b border-[#CBC9C0] pb-8">
          <Link
            href="/admin/patches"
            className="text-[11px] font-bold tracking-[0.16em] text-[#4B4A47] transition hover:text-[#B88A3B]"
          >
            ← BACK TO PATCHES
          </Link>

          <p className="mt-8 mb-3 text-[11px] font-bold tracking-[0.2em] text-[#B88A3B]">
            CONTENT MANAGEMENT
          </p>

          <h1 className="font-serif text-4xl font-bold tracking-tight">
            Add Patch
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#4B4A47]">
            Create a new game patch and connect it
            to a game.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-8"
        >
          {error && (
            <div className="border border-[#CBC9C0] bg-[#ECE9D2] px-5 py-4 text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="game"
              className="mb-2 block text-[11px] font-bold tracking-[0.16em]"
            >
              GAME
            </label>

            <select
              id="game"
              value={gameId}
              onChange={(event) =>
                setGameId(event.target.value)
              }
              disabled={loadingGames || saving}
              required
              className="w-full border border-[#CBC9C0] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B88A3B]"
            >
              {loadingGames ? (
                <option value="">
                  Loading games...
                </option>
              ) : (
                <>
                  <option value="">
                    Select a game
                  </option>

                  {games.map((game) => (
                    <option
                      key={game.id}
                      value={game.id}
                    >
                      {game.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <label
                htmlFor="version"
                className="mb-2 block text-[11px] font-bold tracking-[0.16em]"
              >
                VERSION
              </label>

              <input
                id="version"
                type="text"
                value={version}
                onChange={(event) =>
                  setVersion(event.target.value)
                }
                placeholder="e.g. 11.2.0"
                disabled={saving}
                required
                className="w-full border border-[#CBC9C0] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B88A3B]"
              />
            </div>

            <div>
              <label
                htmlFor="releaseDate"
                className="mb-2 block text-[11px] font-bold tracking-[0.16em]"
              >
                RELEASE DATE
              </label>

              <input
                id="releaseDate"
                type="date"
                value={releaseDate}
                onChange={(event) =>
                  setReleaseDate(
                    event.target.value
                  )
                }
                disabled={saving}
                className="w-full border border-[#CBC9C0] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B88A3B]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-[11px] font-bold tracking-[0.16em]"
            >
              PATCH TITLE
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="e.g. World of Warcraft Patch 11.2.0"
              disabled={saving}
              required
              className="w-full border border-[#CBC9C0] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B88A3B]"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-[11px] font-bold tracking-[0.16em]"
            >
              DESCRIPTION
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Describe this patch..."
              disabled={saving}
              rows={6}
              className="w-full resize-y border border-[#CBC9C0] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#B88A3B]"
            />
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-[#CBC9C0] pt-6">
            <Link
              href="/admin/patches"
              className="px-5 py-3 text-[11px] font-bold tracking-[0.16em] text-[#4B4A47] transition hover:text-[#B88A3B]"
            >
              CANCEL
            </Link>

            <button
              type="submit"
              disabled={
                saving ||
                loadingGames ||
                !gameId
              }
              className="border border-[#1F1D1A] bg-[#1F1D1A] px-6 py-3 text-[11px] font-bold tracking-[0.16em] text-[#FFFAEB] transition hover:border-[#B88A3B] hover:bg-[#B88A3B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "SAVING..."
                : "CREATE PATCH"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}