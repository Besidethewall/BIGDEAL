"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTagPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(value: string) {
    setName(value);

    if (!slugEdited) {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      setSlug(generatedSlug);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const cleanName = name.trim();
    const cleanSlug = slug.trim();

    if (!cleanName || !cleanSlug) {
      setError("Tag name and slug are required.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/admin/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          slug: cleanSlug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create tag."
        );
      }

      router.push("/admin/tags");
    } catch (error) {
      console.error("Create tag failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create tag."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="border-b border-[#CBC9C0] pb-6">
          <Link
            href="/admin/tags"
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B4A47] hover:text-[#B88A3B]"
          >
            ← Back to Tags
          </Link>

          <p className="mb-2 mt-8 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B88A3B]">
            Editorial System
          </p>

          <h1 className="font-serif text-4xl font-bold">
            Add Tag
          </h1>

          <p className="mt-2 text-sm text-[#4B4A47]">
            Create a reusable editorial tag for BIGDEAL.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-8"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em]"
            >
              Tag Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                handleNameChange(event.target.value)
              }
              placeholder="e.g. AION 2"
              className="w-full border border-[#CBC9C0] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1F1D1A]"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em]"
            >
              Slug
            </label>

            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(event) => {
                setSlugEdited(true);
                setSlug(event.target.value);
              }}
              placeholder="e.g. aion-2"
              className="w-full border border-[#CBC9C0] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1F1D1A]"
            />

            <p className="mt-2 text-xs text-[#4B4A47]">
              Used in URLs and internal editorial references.
            </p>
          </div>

          {error && (
            <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4 border-t border-[#CBC9C0] pt-6">
            <button
              type="submit"
              disabled={saving}
              className="border border-[#1F1D1A] bg-[#1F1D1A] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FFFAEB] transition hover:bg-[#B88A3B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Tag"}
            </button>

            <Link
              href="/admin/tags"
              className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B4A47] hover:text-[#B88A3B]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}