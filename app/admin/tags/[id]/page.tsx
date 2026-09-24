"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Tag = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
};

export default function EditTagPage() {
  const params = useParams();
  const router = useRouter();

  const tagId = params.id as string;

  const [tag, setTag] = useState<Tag | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadTag() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/admin/tags/${tagId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to fetch tag."
          );
        }

        setTag(data);
        setName(data.name);
        setSlug(data.slug);
      } catch (error) {
        console.error("Load tag failed:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load tag."
        );
      } finally {
        setLoading(false);
      }
    }

    if (tagId) {
      loadTag();
    }
  }, [tagId]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanSlug = slug.trim();

    if (!cleanName || !cleanSlug) {
      setError("Tag name and slug are required.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/tags/${tagId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: cleanName,
            slug: cleanSlug,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update tag."
        );
      }

      setTag(data);
      setName(data.name);
      setSlug(data.slug);

      setSuccess("Tag updated successfully.");
    } catch (error) {
      console.error("Update tag failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update tag."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <p className="text-sm text-[#4B4A47]">
            Loading tag...
          </p>
        </div>
      </main>
    );
  }

  if (error && !tag) {
    return (
      <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <Link
            href="/admin/tags"
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B4A47] hover:text-[#B88A3B]"
          >
            ← Back to Tags
          </Link>

          <div className="mt-8 border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        </div>
      </main>
    );
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
            Edit Tag
          </h1>

          <p className="mt-2 text-sm text-[#4B4A47]">
            Update the editorial tag information.
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
                setName(event.target.value)
              }
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
              onChange={(event) =>
                setSlug(event.target.value)
              }
              className="w-full border border-[#CBC9C0] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1F1D1A]"
            />

            <p className="mt-2 text-xs text-[#4B4A47]">
              Used in URLs and internal editorial references.
            </p>
          </div>

          <div className="border-t border-[#CBC9C0] pt-5 text-xs text-[#4B4A47]">
            Tag ID: {tag?.id}
          </div>

          {error && (
            <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <div className="flex items-center gap-4 border-t border-[#CBC9C0] pt-6">
            <button
              type="submit"
              disabled={saving}
              className="border border-[#1F1D1A] bg-[#1F1D1A] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FFFAEB] transition hover:bg-[#B88A3B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/tags")}
              className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B4A47] hover:text-[#B88A3B]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}