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

type Source = {
  id: number;
  title: string;
  url: string;
  sourceType: string;
  publisher: string | null;
  author: string | null;
  summary: string | null;
};

export default function ResearchProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceType, setSourceType] = useState("WEB");
  const [sourceSummary, setSourceSummary] = useState("");
  const [savingSource, setSavingSource] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/research/projects/${params.id}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setProject(data);

        const sourcesResponse = await fetch(
          `/api/admin/research/sources?projectId=${params.id}`
        );

        if (sourcesResponse.ok) {
          setSources(await sourcesResponse.json());
        }
      })
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) {
    return <main className="p-10">{error}</main>;
  }

  if (!project) {
    return <main className="p-10">Loading research project...</main>;
  }

  async function handleAddSource(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingSource(true);

    try {
      const response = await fetch("/api/admin/research/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: Number(params.id),
          title: sourceTitle.trim(),
          url: sourceUrl.trim(),
          sourceType,
          summary: sourceSummary.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add source.");
      }

      setSources((current) => [...current, data]);
      setSourceTitle("");
      setSourceUrl("");
      setSourceSummary("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add source.");
    } finally {
      setSavingSource(false);
    }
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

        <section className="mt-12 border-t border-[#CBC9C0] pt-10">
          <h2 className="text-xs font-bold tracking-[0.16em]">
            RESEARCH SOURCES
          </h2>

          <form onSubmit={handleAddSource} className="mt-6 space-y-5">
            <input
              required
              value={sourceTitle}
              onChange={(event) => setSourceTitle(event.target.value)}
              placeholder="Source title"
              className="w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none"
            />

            <input
              required
              type="url"
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
              placeholder="https://example.com/source"
              className="w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none"
            />

            <select
              value={sourceType}
              onChange={(event) => setSourceType(event.target.value)}
              className="w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none"
            >
              <option value="WEB">WEB</option>
              <option value="BOOK">BOOK</option>
              <option value="VIDEO">VIDEO</option>
              <option value="ARCHIVE">ARCHIVE</option>
            </select>

            <textarea
              value={sourceSummary}
              onChange={(event) => setSourceSummary(event.target.value)}
              placeholder="Summary"
              rows={3}
              className="w-full border border-[#CBC9C0] bg-transparent px-4 py-3 text-sm outline-none"
            />

            <button
              type="submit"
              disabled={savingSource}
              className="border border-[#1F1D1A] bg-[#1F1D1A] px-6 py-3 text-[10px] font-bold tracking-[0.16em] text-[#FFFAEB] disabled:opacity-50"
            >
              {savingSource ? "ADDING..." : "ADD SOURCE"}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            {sources.length === 0 ? (
              <p className="text-sm text-[#4B4A47]">No sources added yet.</p>
            ) : (
              sources.map((source) => (
                <article
                  key={source.id}
                  className="border-b border-[#CBC9C0] pb-4"
                >
                  <h3 className="font-serif text-xl">{source.title}</h3>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block text-sm text-[#B88A3B] underline"
                  >
                    {source.url}
                  </a>
                  {source.summary && (
                    <p className="mt-2 text-sm leading-6 text-[#4B4A47]">
                      {source.summary}
                    </p>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
