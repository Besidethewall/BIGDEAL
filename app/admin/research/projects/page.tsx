"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Game = {
  id: number;
  name: string;
};

type ResearchProject = {
  id: number;
  gameId: number;
  title: string;
  slug: string;
  researchQuestion: string | null;
  objective: string | null;
  status: string;
  createdAt: string;
};

export default function ResearchProjectsPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [gamesResponse, projectsResponse] = await Promise.all([
          fetch("/api/games"),
          fetch("/api/admin/research/projects"),
        ]);

        if (!gamesResponse.ok || !projectsResponse.ok) {
          throw new Error("Failed to load research data");
        }

        setGames(await gamesResponse.json());
        setProjects(await projectsResponse.json());
      } catch (error) {
        console.error("Research projects failed:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
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
            <div className="text-3xl font-black tracking-[-0.05em]">BIGDEAL</div>
            <div className="mt-1 text-[9px] font-semibold tracking-[0.24em] text-[#4B4A47]">
              EDITORIAL SYSTEM
            </div>
          </Link>

          <Link
            href="/"
            className="text-[10px] font-bold tracking-[0.16em] text-[#4B4A47] hover:text-[#B88A3B]"
          >
            VIEW SITE
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
        <div className="flex flex-col justify-between gap-6 border-b border-[#CBC9C0] pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
              ADMIN / RESEARCH
            </div>
            <h1 className="mt-3 font-serif text-5xl tracking-[-0.04em]">
              Research Projects
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4B4A47]">
              Organize research projects, sources, claims, and evidence for the
              BIGDEAL editorial system.
            </p>
          </div>

          <Link
            href="/admin/research/projects/new"
            className="border border-[#1F1D1A] px-6 py-4 text-[10px] font-bold tracking-[0.16em] hover:bg-[#1F1D1A] hover:text-[#FFFAEB]"
          >
            NEW PROJECT
          </Link>
        </div>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between border-b border-[#CBC9C0] pb-4">
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                RESEARCH DATABASE
              </div>
              <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em]">
                All projects
              </h2>
            </div>
            <div className="text-[9px] font-bold tracking-[0.16em] text-[#4B4A47]">
              {loading ? "LOADING" : `${projects.length} PROJECTS`}
            </div>
          </div>

          {loading ? (
            <div className="border border-[#CBC9C0] px-6 py-12 text-sm text-[#4B4A47]">
              Loading research projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="border border-[#CBC9C0] px-6 py-12 text-sm text-[#4B4A47]">
              No research projects found.
            </div>
          ) : (
            <div className="border border-[#CBC9C0]">
              {projects.map((project, index) => (
                <article
                  key={project.id}
                  className={`grid gap-6 px-6 py-7 lg:grid-cols-[1fr_180px_130px_120px] lg:items-center ${
                    index !== 0 ? "border-t border-[#CBC9C0]" : ""
                  }`}
                >
                  <div>
                    <div className="text-[9px] font-bold tracking-[0.18em] text-[#B88A3B]">
                      {getGameName(project.gameId)}
                    </div>
                    <h3 className="mt-2 font-serif text-2xl leading-tight">
                      {project.title}
                    </h3>
                    <div className="mt-3 text-[9px] tracking-[0.12em] text-[#4B4A47]">
                      /research/{project.slug}
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-bold tracking-[0.16em] text-[#4B4A47]">
                      STATUS
                    </div>
                    <div className="mt-2 text-[10px] font-bold tracking-[0.12em]">
                      {project.status}
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-bold tracking-[0.16em] text-[#4B4A47]">
                      CREATED
                    </div>
                    <div className="mt-2 text-[10px] tracking-[0.08em]">
                      {formatDate(project.createdAt)}
                    </div>
                  </div>

                  <div className="lg:text-right">
                    <span className="border-b border-[#CBC9C0] pb-1 text-[9px] font-bold tracking-[0.14em] text-[#9A9891]">
                      OPEN
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
