"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleNameChange(value: string) {
    setName(value);

    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create category."
        );
      }

      setSuccess("Category created successfully.");

      setTimeout(() => {
        router.push("/admin/categories");
      }, 700);
    } catch (error) {
      console.error("Create category failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create category."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10">
        <header className="border-b border-[#CBC9C0] pb-8">
          <p className="text-[10px] font-bold tracking-[0.22em] text-[#B88A3B]">
            ADMIN / CATEGORIES / NEW
          </p>

          <h1 className="mt-3 font-serif text-4xl tracking-[-0.02em]">
            New Category
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4B4A47]">
            Create a new global editorial category for BIGDEAL.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-8"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-[10px] font-bold tracking-[0.16em]"
            >
              NAME
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                handleNameChange(event.target.value)
              }
              placeholder="e.g. Dungeons"
              required
              className="mt-3 w-full border border-[#CBC9C0] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[#1F1D1A]"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-[10px] font-bold tracking-[0.16em]"
            >
              SLUG
            </label>

            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(event) =>
                setSlug(generateSlug(event.target.value))
              }
              placeholder="e.g. dungeons"
              required
              className="mt-3 w-full border border-[#CBC9C0] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[#1F1D1A]"
            />

            <p className="mt-2 text-xs text-[#4B4A47]">
              Used as the permanent URL-friendly identifier.
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-[10px] font-bold tracking-[0.16em]"
            >
              DESCRIPTION
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe how this category is used editorially."
              rows={5}
              className="mt-3 w-full resize-y border border-[#CBC9C0] bg-transparent px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#1F1D1A]"
            />
          </div>

          {error && (
            <div className="border border-[#CBC9C0] bg-[#ECE9D2] p-4">
              <p className="text-sm font-semibold">
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="border border-[#CBC9C0] bg-[#ECE9D2] p-4">
              <p className="text-sm font-semibold text-[#3A6D78]">
                {success}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-[#CBC9C0] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/admin/categories"
              className="text-[10px] font-bold tracking-[0.16em] underline decoration-[#CBC9C0] underline-offset-4 transition hover:text-[#B88A3B]"
            >
              CANCEL
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="border border-[#1F1D1A] bg-[#1F1D1A] px-6 py-3 text-[10px] font-bold tracking-[0.16em] text-[#FFFAEB] transition hover:bg-[#B88A3B] hover:border-[#B88A3B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "CREATING..." : "CREATE CATEGORY"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}