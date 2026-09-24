"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Game = {
  id: number;
  name: string;
  slug: string;
};

type Patch = {
  id: number;
  gameId: number;
  version: string;
  title: string;
  description: string | null;
  releaseDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function PatchesPage() {
  const [patches, setPatches] = useState<Patch[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [patchesResponse, gamesResponse] =
          await Promise.all([
            fetch("/api/admin/patches"),
            fetch("/api/admin/games"),
          ]);

        if (!patchesResponse.ok) {
          throw new Error("Failed to fetch patches.");
        }

        if (!gamesResponse.ok) {
          throw new Error("Failed to fetch games.");
        }

        const patchesData: Patch[] =
          await patchesResponse.json();

        const gamesData: Game[] =
          await gamesResponse.json();

        setPatches(patchesData);
        setGames(gamesData);
      } catch (error) {
        console.error(
          "Patches page failed:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load patches."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function getGameName(gameId: number) {
    const game = games.find(
      (item) => item.id === gameId
    );

    return game?.name ?? "Unknown Game";
  }

  function formatReleaseDate(
    releaseDate: string | null
  ) {
    if (!releaseDate) {
      return "—";
    }

    const date = new Date(releaseDate);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  return (
    <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-6 border-b border-[#CBC9C0] pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-[#B88A3B]">
              CONTENT MANAGEMENT
            </p>

            <h1 className="font-serif text-4xl font-bold tracking-tight">
              Patches
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4B4A47]">
              Manage game patches, versions, release
              dates, and editorial patch context.
            </p>
          </div>

          <Link
            href="/admin/patches/new"
            className="inline-flex items-center justify-center border border-[#1F1D1A] bg-[#1F1D1A] px-5 py-3 text-[11px] font-bold tracking-[0.16em] text-[#FFFAEB] transition hover:bg-[#B88A3B] hover:border-[#B88A3B]"
          >
            ADD PATCH
          </Link>
        </div>

        {loading && (
          <div className="py-12 text-sm text-[#4B4A47]">
            Loading patches...
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 border border-[#CBC9C0] bg-[#ECE9D2] px-5 py-4 text-sm text-[#1F1D1A]">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          patches.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-serif text-2xl font-bold">
                No patches yet.
              </p>

              <p className="mt-2 text-sm text-[#4B4A47]">
                Add your first game patch to begin.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          patches.length > 0 && (
            <div className="mt-8 overflow-hidden border border-[#CBC9C0]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#CBC9C0] bg-[#ECE9D2] text-left">
                      <th className="px-5 py-4 text-[10px] font-bold tracking-[0.16em]">
                        GAME
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold tracking-[0.16em]">
                        VERSION
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold tracking-[0.16em]">
                        TITLE
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold tracking-[0.16em]">
                        RELEASE DATE
                      </th>

                      <th className="px-5 py-4 text-right text-[10px] font-bold tracking-[0.16em]">
                        ACTION
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {patches.map((patch) => (
                      <tr
                        key={patch.id}
                        className="border-b border-[#CBC9C0] last:border-b-0"
                      >
                        <td className="px-5 py-5">
                          <span className="text-sm font-semibold">
                            {getGameName(
                              patch.gameId
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <span className="inline-block bg-[#1F1D1A] px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] text-[#FFFAEB]">
                            {patch.version}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="max-w-md">
                            <p className="text-sm font-semibold">
                              {patch.title}
                            </p>

                            {patch.description && (
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#4B4A47]">
                                {patch.description}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-5 text-sm text-[#4B4A47]">
                          {formatReleaseDate(
                            patch.releaseDate
                          )}
                        </td>

                        <td className="px-5 py-5 text-right">
                          <Link
                            href={`/admin/patches/${patch.id}`}
                            className="text-[11px] font-bold tracking-[0.14em] text-[#1F1D1A] underline decoration-[#B88A3B] underline-offset-4 transition hover:text-[#B88A3B]"
                          >
                            EDIT
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </main>
  );
}