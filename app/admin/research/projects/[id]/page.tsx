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

type Claim = {
  id: number;
  statement: string;
  classification: string;
  status: string;
  importance: string;
};

type Evidence = {
  id: number;
  claimId: number;
  sourceId: number;
  evidenceText: string;
  sourceLocator: string | null;
  relationship: string;
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
  const [claims, setClaims] = useState<Claim[]>([]);
  const [claimStatement, setClaimStatement] = useState("");
  const [claimClassification, setClaimClassification] = useState("UNVERIFIED");
  const [claimStatus, setClaimStatus] = useState("OPEN");
  const [claimImportance, setClaimImportance] = useState("MEDIUM");
  const [savingClaim, setSavingClaim] = useState(false);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [evidenceClaimId, setEvidenceClaimId] = useState("");
  const [evidenceSourceId, setEvidenceSourceId] = useState("");
  const [evidenceText, setEvidenceText] = useState("");
  const [sourceLocator, setSourceLocator] = useState("");
  const [relationship, setRelationship] = useState("SUPPORTS");
  const [savingEvidence, setSavingEvidence] = useState(false);

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

        const claimsResponse = await fetch(
          `/api/admin/research/claims?projectId=${params.id}`
        );

        if (claimsResponse.ok) {
          setClaims(await claimsResponse.json());
        }

        const evidenceResponse = await fetch(
          `/api/admin/research/evidence?projectId=${params.id}`
        );

        if (evidenceResponse.ok) {
          setEvidence(await evidenceResponse.json());
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

  async function handleAddClaim(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingClaim(true);

    try {
      const response = await fetch("/api/admin/research/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          researchProjectId: Number(params.id),
          statement: claimStatement.trim(),
          classification: claimClassification,
          status: claimStatus,
          importance: claimImportance,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add claim.");
      }

      setClaims((current) => [...current, data]);
      setClaimStatement("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add claim.");
    } finally {
      setSavingClaim(false);
    }
  }

  async function handleAddEvidence(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSavingEvidence(true);

    try {
      const response = await fetch("/api/admin/research/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          researchProjectId: Number(params.id),
          claimId: Number(evidenceClaimId),
          sourceId: Number(evidenceSourceId),
          evidenceText: evidenceText.trim(),
          sourceLocator: sourceLocator.trim(),
          relationship,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add evidence.");
      }

      setEvidence((current) => [...current, data]);
      setEvidenceClaimId("");
      setEvidenceSourceId("");
      setEvidenceText("");
      setSourceLocator("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to add evidence."
      );
    } finally {
      setSavingEvidence(false);
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

          <h2 className="text-xs font-bold tracking-[0.16em]">
            RESEARCH CLAIMS
          </h2>

          <form onSubmit={handleAddClaim} className="mt-6 space-y-5">
            <textarea
              required
              value={claimStatement}
              onChange={(event) => setClaimStatement(event.target.value)}
              placeholder="Write a research claim..."
              rows={4}
              className="w-full border border-[#CBC9C0] bg-transparent px-4 py-3 text-sm outline-none"
            />

            <div className="grid gap-5 sm:grid-cols-3">
              <label className="text-[10px] font-bold tracking-[0.16em]">
                CLASSIFICATION
                <select
                  value={claimClassification}
                  onChange={(event) => setClaimClassification(event.target.value)}
                  className="mt-2 w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none"
                >
                  <option value="UNVERIFIED">UNVERIFIED</option>
                  <option value="SUPPORTED">SUPPORTED</option>
                  <option value="DISPUTED">DISPUTED</option>
                </select>
              </label>

              <label className="text-[10px] font-bold tracking-[0.16em]">
                STATUS
                <select
                  value={claimStatus}
                  onChange={(event) => setClaimStatus(event.target.value)}
                  className="mt-2 w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="REVIEWED">REVIEWED</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </label>

              <label className="text-[10px] font-bold tracking-[0.16em]">
                IMPORTANCE
                <select
                  value={claimImportance}
                  onChange={(event) => setClaimImportance(event.target.value)}
                  className="mt-2 w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              disabled={savingClaim}
              className="border border-[#1F1D1A] bg-[#1F1D1A] px-6 py-3 text-[10px] font-bold tracking-[0.16em] text-[#FFFAEB] disabled:opacity-50"
            >
              {savingClaim ? "ADDING..." : "ADD CLAIM"}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            {claims.length === 0 ? (
              <p className="text-sm text-[#4B4A47]">No claims added yet.</p>
            ) : (
              claims.map((claim) => (
                <article
                  key={claim.id}
                  className="border-b border-[#CBC9C0] pb-5"
                >
                  <p className="font-serif text-xl">{claim.statement}</p>
                  <div className="mt-3 text-[10px] font-bold tracking-[0.12em] text-[#B88A3B]">
                    {claim.classification} · {claim.status} · {claim.importance}
                  </div>
                </article>
              ))
            )}
          </div>

          <h2 className="text-xs font-bold tracking-[0.16em]">
            RESEARCH EVIDENCE
          </h2>

          <form onSubmit={handleAddEvidence} className="mt-6 space-y-5">
            <label className="block text-[10px] font-bold tracking-[0.16em]">
              CLAIM
              <select
                required
                value={evidenceClaimId}
                onChange={(event) => setEvidenceClaimId(event.target.value)}
                className="mt-2 w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none"
              >
                <option value="">Select a claim</option>
                {claims.map((claim) => (
                  <option key={claim.id} value={claim.id}>
                    {claim.statement}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-[10px] font-bold tracking-[0.16em]">
              SOURCE
              <select
                required
                value={evidenceSourceId}
                onChange={(event) => setEvidenceSourceId(event.target.value)}
                className="mt-2 w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none"
              >
                <option value="">Select a source</option>
                {sources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-[10px] font-bold tracking-[0.16em]">
              EVIDENCE TEXT
              <textarea
                required
                value={evidenceText}
                onChange={(event) => setEvidenceText(event.target.value)}
                rows={4}
                className="mt-2 w-full border border-[#CBC9C0] bg-transparent px-4 py-3 text-sm outline-none"
                placeholder="Explain how this source supports the claim..."
              />
            </label>

            <label className="block text-[10px] font-bold tracking-[0.16em]">
              SOURCE LOCATOR
              <input
                value={sourceLocator}
                onChange={(event) => setSourceLocator(event.target.value)}
                placeholder="Page, timestamp, or section"
                className="mt-2 w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none"
              />
            </label>

            <label className="block text-[10px] font-bold tracking-[0.16em]">
              RELATIONSHIP
              <select
                value={relationship}
                onChange={(event) => setRelationship(event.target.value)}
                className="mt-2 w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none"
              >
                <option value="SUPPORTS">SUPPORTS</option>
                <option value="CONTRADICTS">CONTRADICTS</option>
                <option value="CONTEXTUALIZES">CONTEXTUALIZES</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={savingEvidence}
              className="border border-[#1F1D1A] bg-[#1F1D1A] px-6 py-3 text-[10px] font-bold tracking-[0.16em] text-[#FFFAEB] disabled:opacity-50"
            >
              {savingEvidence ? "ADDING..." : "ADD EVIDENCE"}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            {evidence.length === 0 ? (
              <p className="text-sm text-[#4B4A47]">
                No evidence added yet.
              </p>
            ) : (
              evidence.map((item) => (
                <article
                  key={item.id}
                  className="border-b border-[#CBC9C0] pb-5"
                >
                  <p className="text-sm leading-7">{item.evidenceText}</p>
                  <div className="mt-3 text-[10px] font-bold tracking-[0.12em] text-[#B88A3B]">
                    {item.relationship}
                    {item.sourceLocator
                      ? ` · ${item.sourceLocator}`
                      : ""}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
