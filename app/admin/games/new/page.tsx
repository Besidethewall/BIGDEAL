"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewGamePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleNameChange(value: string) {
    setName(value);

    if (!slug || slug === createSlug(name)) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!name.trim() || !slug.trim()) {
      setError("Game name and slug are required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          logo: logo.trim(),
          isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create game."
        );
      }

      router.push(`/admin/games/${data.id}`);
    } catch (error) {
      console.error("Create game failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create game."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
      <header className="border-b border-[#CBC9C0]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 lg:px-10">
          <a href="/admin" className="block">
            <div className="text-3xl font-black tracking-[-0.05em]">
              BIGDEAL
            </div>

            <div className="mt-1 text-[9px] font-semibold tracking-[0.24em] text-[#4B4A47]">
              EDITORIAL SYSTEM
            </div>
          </a>

          <div className="flex items-center gap-6">
            <a
              href="/admin/games"
              className="text-[10px] font-bold tracking-[0.16em] text-[#4B4A47] transition hover:text-[#B88A3B]"
            >
              GAMES
            </a>

            <a
              href="/"
              className="text-[10px] font-bold tracking-[0.16em] text-[#4B4A47] transition hover:text-[#B88A3B]"
            >
              VIEW SITE
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-6 py-10 lg:px-10 lg:py-14">
        <div className="border-b border-[#CBC9C0] pb-8">
          <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
            ADMIN / GAMES / NEW
          </div>

          <h1 className="mt-3 font-serif text-5xl tracking-[-0.04em]">
            Add Game
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4B4A47]">
            Add a new game to the BIGDEAL editorial system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10">
          {error && (
            <div className="mb-8 border border-[#B88A3B] bg-[#ECE9D2] px-5 py-4 text-sm leading-6">
              {error}
            </div>
          )}

          <div className="space-y-10">
            <section className="border-b border-[#CBC9C0] pb-10">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                GAME INFORMATION
              </div>

              <div className="mt-6 space-y-7">
                <div>
                  <label
                    htmlFor="name"
                    className="text-[10px] font-bold tracking-[0.16em]"
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
                    placeholder="World of Warcraft"
                    className="mt-3 w-full border-b border-[#CBC9C0] bg-transparent py-4 font-serif text-3xl outline-none focus:border-[#1F1D1A]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="slug"
                    className="text-[10px] font-bold tracking-[0.16em]"
                  >
                    SLUG
                  </label>

                  <input
                    id="slug"
                    type="text"
                    value={slug}
                    onChange={(event) =>
                      setSlug(createSlug(event.target.value))
                    }
                    placeholder="world-of-warcraft"
                    className="mt-3 w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none focus:border-[#1F1D1A]"
                  />

                  <p className="mt-2 text-[10px] tracking-[0.08em] text-[#4B4A47]">
                    /{slug || "game-slug"}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="text-[10px] font-bold tracking-[0.16em]"
                  >
                    DESCRIPTION
                  </label>

                  <textarea
                    id="description"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    rows={5}
                    className="mt-3 w-full resize-none border border-[#CBC9C0] bg-transparent px-4 py-4 text-sm leading-7 outline-none focus:border-[#1F1D1A]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="logo"
                    className="text-[10px] font-bold tracking-[0.16em]"
                  >
                    LOGO URL
                  </label>

                  <input
                    id="logo"
                    type="text"
                    value={logo}
                    onChange={(event) =>
                      setLogo(event.target.value)
                    }
                    placeholder="https://..."
                    className="mt-3 w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none focus:border-[#1F1D1A]"
                  />
                </div>
              </div>
            </section>

            <section className="border-b border-[#CBC9C0] pb-10">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                PUBLICATION STATUS
              </div>

              <div className="mt-6 flex items-center justify-between border border-[#CBC9C0] px-5 py-5">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.16em]">
                    GAME STATUS
                  </div>

                  <div className="mt-2 text-sm text-[#4B4A47]">
                    {isActive
                      ? "This game will be active across BIGDEAL."
                      : "This game will be created as inactive."}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsActive((value) => !value)
                  }
                  className={`border px-5 py-3 text-[10px] font-bold tracking-[0.14em] transition ${
                    isActive
                      ? "border-[#3A6D78] text-[#3A6D78] hover:bg-[#3A6D78] hover:text-[#FFFAEB]"
                      : "border-[#CBC9C0] text-[#4B4A47] hover:border-[#1F1D1A]"
                  }`}
                >
                  {isActive ? "ACTIVE" : "INACTIVE"}
                </button>
              </div>
            </section>

            <section>
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                    GAME MANAGEMENT
                  </div>

                  <div className="mt-2 text-sm text-[#4B4A47]">
                    The new game will be saved to the BIGDEAL database.
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="/admin/games"
                    className="border border-[#CBC9C0] px-6 py-4 text-[10px] font-bold tracking-[0.16em] transition hover:border-[#1F1D1A]"
                  >
                    CANCEL
                  </a>

                  <button
                    type="submit"
                    disabled={saving}
                    className="border border-[#1F1D1A] bg-[#1F1D1A] px-7 py-4 text-[10px] font-bold tracking-[0.16em] text-[#FFFAEB] transition hover:border-[#B88A3B] hover:bg-[#B88A3B] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "SAVING..." : "CREATE GAME"}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>
    </main>
  );
}