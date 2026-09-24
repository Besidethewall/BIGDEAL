"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Project = {
  id: number;
  gameId: number;
  title: string;
  slug: string;
  researchQuestion: string | null;
  objective: string | null;
  status: string;
  createdAt: string;
};

export default function ResearchProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/research/projects/${params.id}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setProject(data);
      })
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) {
    return <main className="p-10">{error}</main>;
  }

  if (!project) {
    return <main className="p-10">Loading research project...</main>;
  }

  return (
    <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
      <header className="border-b border-[#CBC9C0]">
        <div className="mx-auto flex max-w-[1100px] justify-between px-6 py-6">
          <Link href="/admin" className="text-3xl font-black">
            BIGDEAL
          </Link>
          <Link href="/admin/research/projects" className="text-xs font-bold">
            RESEARCH PROJECTS
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <div className="text-xs font-bold tracking-[0.2em] text-[#B88A3B]">
          RESEARCH PROJECT
        </div>

        <h1 className="mt-4 font-serif text-5xl">{project.title}</h1>

        <div className="mt-8 grid gap-6 border-y border-[#CBC9C0] py-8 sm:grid-cols-3">
          <div>
            <div className="text-xs font-bold">STATUS</div>
            <div className="mt-2">{project.status}</div>
          </div>

          <div>
            <div className="text-xs font-bold">SLUG</div>
            <div className="mt-2">{project.slug}</div>
          </div>

          <div>
            <div className="text-xs font-bold">GAME ID</div>
            <div className="mt-2">{project.gameId}</div>
          </div>
        </div>

        <section className="mt-10 space-y-8">
          <div>
            <h2 className="text-xs font-bold tracking-[0.16em]">
              RESEARCH QUESTION
            </h2>
            <p className="mt-3 leading-7 text-[#4B4A47]">
              {project.researchQuestion || "Not provided."}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-[0.16em]">OBJECTIVE</h2>
            <p className="mt-3 leading-7 text-[#4B4A47]">
              {project.objective || "Not provided."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
