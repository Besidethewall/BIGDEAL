"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Tag = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
};

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTags() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/tags");

      if (!response.ok) {
        throw new Error("Failed to fetch tags.");
      }

      const data: Tag[] = await response.json();

      setTags(data);
    } catch (error) {
      console.error("Tags page failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load tags."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTags();
  }, []);

  return (
    <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-end justify-between border-b border-[#CBC9C0] pb-6">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B88A3B]">
              Editorial System
            </p>

            <h1 className="font-serif text-4xl font-bold">
              Tags
            </h1>

            <p className="mt-2 text-sm text-[#4B4A47]">
              Manage reusable editorial tags across BIGDEAL.
            </p>
          </div>

          <Link
            href="/admin/tags/new"
            className="border border-[#1F1D1A] bg-[#1F1D1A] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FFFAEB] transition hover:bg-[#B88A3B]"
          >
            Add Tag
          </Link>
        </div>

        {loading && (
          <div className="py-12 text-sm text-[#4B4A47]">
            Loading tags...
          </div>
        )}

        {error && (
          <div className="mt-8 border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-8 border-t border-[#CBC9C0]">
            {tags.length === 0 ? (
              <div className="py-12 text-sm text-[#4B4A47]">
                No tags found.
              </div>
            ) : (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className="grid grid-cols-[1fr_1fr_auto] items-center gap-6 border-b border-[#CBC9C0] py-5"
                >
                  <div>
                    <h2 className="font-serif text-xl font-bold">
                      {tag.name}
                    </h2>

                    <p className="mt-1 text-xs text-[#4B4A47]">
                      /{tag.slug}
                    </p>
                  </div>

                  <div className="text-xs text-[#4B4A47]">
                    ID: {tag.id}
                  </div>

                  <div>
                    <Link
                      href={`/admin/tags/${tag.id}`}
                      className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F1D1A] hover:text-[#B88A3B]"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}