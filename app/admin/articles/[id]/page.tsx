"use client";

import { useEffect, useState } from "react";

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
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Tag = {
  id: number;
  name: string;
  slug: string;
};

type Article = {
  id: number;
  gameId: number;
  patchId: number | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  categoryIds: number[];
  tagIds: number[];
};

export default function AdminArticleEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [article, setArticle] =
    useState<Article | null>(null);

  const [games, setGames] =
    useState<Game[]>([]);

  const [patches, setPatches] =
    useState<Patch[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [tags, setTags] =
    useState<Tag[]>([]);

  const [gameId, setGameId] =
    useState("");

  const [patchId, setPatchId] =
    useState("");

  const [categoryIds, setCategoryIds] =
    useState<number[]>([]);

  const [tagIds, setTagIds] =
    useState<number[]>([]);

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [excerpt, setExcerpt] =
    useState("");

  const [content, setContent] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    async function loadEditor() {
      try {
        const { id } = await params;

        const [
          articleResponse,
          gamesResponse,
          patchesResponse,
          categoriesResponse,
          tagsResponse,
        ] = await Promise.all([
          fetch(
            `/api/admin/articles/${encodeURIComponent(id)}`
          ),
          fetch("/api/games"),
          fetch("/api/admin/patches"),
          fetch("/api/admin/categories"),
          fetch("/api/admin/tags"),
        ]);

        if (!articleResponse.ok) {
          throw new Error(
            "Failed to load article."
          );
        }

        if (!gamesResponse.ok) {
          throw new Error(
            "Failed to load games."
          );
        }

        if (!patchesResponse.ok) {
          throw new Error(
            "Failed to load patches."
          );
        }

        if (!categoriesResponse.ok) {
          throw new Error(
            "Failed to load categories."
          );
        }

        if (!tagsResponse.ok) {
          throw new Error(
            "Failed to load tags."
          );
        }

        const articleData: Article =
          await articleResponse.json();

        const gamesData: Game[] =
          await gamesResponse.json();

        const patchesData: Patch[] =
          await patchesResponse.json();

        const categoriesData: Category[] =
          await categoriesResponse.json();

        const tagsData: Tag[] =
          await tagsResponse.json();

        setArticle(articleData);
        setGames(gamesData);
        setPatches(patchesData);
        setCategories(categoriesData);
        setTags(tagsData);

        setGameId(
          String(articleData.gameId)
        );

        setPatchId(
          articleData.patchId !== null
            ? String(articleData.patchId)
            : ""
        );

        setCategoryIds(
          Array.isArray(
            articleData.categoryIds
          )
            ? articleData.categoryIds
            : []
        );

        setTagIds(
          Array.isArray(
            articleData.tagIds
          )
            ? articleData.tagIds
            : []
        );

        setTitle(articleData.title);
        setSlug(articleData.slug);
        setExcerpt(
          articleData.excerpt ?? ""
        );
        setContent(articleData.content);
      } catch (error) {
        console.error(
          "Article editor failed:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load article."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEditor();
  }, [params]);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(
    value: string
  ) {
    setTitle(value);

    if (
      !slug ||
      slug === createSlug(title)
    ) {
      setSlug(createSlug(value));
    }
  }

  function handleGameChange(
    value: string
  ) {
    setGameId(value);

    const selectedGameId =
      Number(value);

    if (!selectedGameId) {
      setPatchId("");
      return;
    }

    if (patchId) {
      const selectedPatch =
        patches.find(
          (patch) =>
            patch.id ===
            Number(patchId)
        );

      if (
        selectedPatch &&
        selectedPatch.gameId !==
          selectedGameId
      ) {
        setPatchId("");
      }
    }
  }

  function toggleCategory(
    id: number
  ) {
    setCategoryIds((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  }

  function toggleTag(id: number) {
    setTagIds((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!article) {
      setError(
        "Article data is not available."
      );
      return;
    }

    if (
      !gameId ||
      !title.trim() ||
      !slug.trim() ||
      !content.trim()
    ) {
      setError(
        "Game, title, slug and content are required."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/articles/${article.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            gameId: Number(gameId),
            patchId: patchId
              ? Number(patchId)
              : null,
            categoryIds,
            tagIds,
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim(),
            content: content.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update article."
        );
      }

      setArticle(data);

      setGameId(
        String(data.gameId)
      );

      setPatchId(
        data.patchId !== null
          ? String(data.patchId)
          : ""
      );

      setCategoryIds(
        Array.isArray(
          data.categoryIds
        )
          ? data.categoryIds
          : []
      );

      setTagIds(
        Array.isArray(data.tagIds)
          ? data.tagIds
          : []
      );

      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(
        data.excerpt ?? ""
      );
      setContent(data.content);

      setSuccess(
        "Article saved successfully."
      );
    } catch (error) {
      console.error(
        "Update article failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update article."
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedGameId =
    Number(gameId);

  const filteredPatches =
    patches.filter(
      (patch) =>
        patch.gameId ===
        selectedGameId
    );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
        <div className="mx-auto max-w-[1100px] px-6 py-20 lg:px-10">
          <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
            BIGDEAL / ADMIN
          </div>

          <p className="mt-6 text-sm text-[#4B4A47]">
            Loading article...
          </p>
        </div>
      </main>
    );
  }

  if (error && !article) {
    return (
      <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
        <header className="border-b border-[#CBC9C0]">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 lg:px-10">
            <a
              href="/admin"
              className="block"
            >
              <div className="text-3xl font-black tracking-[-0.05em]">
                BIGDEAL
              </div>

              <div className="mt-1 text-[9px] font-semibold tracking-[0.24em] text-[#4B4A47]">
                EDITORIAL SYSTEM
              </div>
            </a>

            <a
              href="/admin/articles"
              className="text-[10px] font-bold tracking-[0.16em] text-[#4B4A47]"
            >
              ARTICLES
            </a>
          </div>
        </header>

        <div className="mx-auto max-w-[1100px] px-6 py-20 lg:px-10">
          <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
            ERROR
          </div>

          <h1 className="mt-4 font-serif text-5xl tracking-[-0.04em]">
            Article could not be loaded.
          </h1>

          <p className="mt-6 text-sm leading-7 text-[#4B4A47]">
            {error}
          </p>

          <a
            href="/admin/articles"
            className="mt-8 inline-block border border-[#1F1D1A] px-6 py-4 text-[10px] font-bold tracking-[0.16em] transition hover:bg-[#1F1D1A] hover:text-[#FFFAEB]"
          >
            BACK TO ARTICLES
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
      <header className="border-b border-[#CBC9C0]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 lg:px-10">
          <a
            href="/admin"
            className="block"
          >
            <div className="text-3xl font-black tracking-[-0.05em]">
              BIGDEAL
            </div>

            <div className="mt-1 text-[9px] font-semibold tracking-[0.24em] text-[#4B4A47]">
              EDITORIAL SYSTEM
            </div>
          </a>

          <div className="flex items-center gap-6">
            <a
              href="/admin/articles"
              className="text-[10px] font-bold tracking-[0.16em] text-[#4B4A47] transition hover:text-[#B88A3B]"
            >
              ARTICLES
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
            ADMIN / ARTICLES / EDIT
          </div>

          <h1 className="mt-3 font-serif text-5xl tracking-[-0.04em]">
            Edit Article
          </h1>

          {article && (
            <div className="mt-4 text-[10px] font-bold tracking-[0.16em] text-[#4B4A47]">
              ARTICLE #{article.id} •{" "}
              {article.status}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10"
        >
          {error && (
            <div className="mb-8 border border-[#B88A3B] bg-[#ECE9D2] px-5 py-4 text-sm leading-6">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-8 border border-[#3A6D78] bg-[#ECE9D2] px-5 py-4 text-sm leading-6">
              {success}
            </div>
          )}

          <div className="space-y-10">
            <section className="border-b border-[#CBC9C0] pb-10">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                STORY INFORMATION
              </div>

              <div className="mt-6 space-y-7">
                <div>
                  <label
                    htmlFor="game"
                    className="text-[10px] font-bold tracking-[0.16em]"
                  >
                    GAME
                  </label>

                  <select
                    id="game"
                    value={gameId}
                    onChange={(event) =>
                      handleGameChange(
                        event.target.value
                      )
                    }
                    className="mt-3 w-full border border-[#CBC9C0] bg-transparent px-4 py-4 text-sm outline-none focus:border-[#1F1D1A]"
                  >
                    {games.map(
                      (game) => (
                        <option
                          key={game.id}
                          value={game.id}
                        >
                          {game.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="patch"
                    className="text-[10px] font-bold tracking-[0.16em]"
                  >
                    PATCH
                  </label>

                  <select
                    id="patch"
                    value={patchId}
                    onChange={(event) =>
                      setPatchId(
                        event.target.value
                      )
                    }
                    className="mt-3 w-full border border-[#CBC9C0] bg-transparent px-4 py-4 text-sm outline-none focus:border-[#1F1D1A]"
                  >
                    <option value="">
                      No Patch
                    </option>

                    {filteredPatches.map(
                      (patch) => (
                        <option
                          key={patch.id}
                          value={patch.id}
                        >
                          {patch.version} —{" "}
                          {patch.title}
                        </option>
                      )
                    )}
                  </select>

                  {filteredPatches.length ===
                    0 && (
                    <p className="mt-2 text-[10px] tracking-[0.08em] text-[#4B4A47]">
                      No patches available
                      for this game.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="title"
                    className="text-[10px] font-bold tracking-[0.16em]"
                  >
                    TITLE
                  </label>

                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(event) =>
                      handleTitleChange(
                        event.target.value
                      )
                    }
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
                      setSlug(
                        createSlug(
                          event.target.value
                        )
                      )
                    }
                    className="mt-3 w-full border-b border-[#CBC9C0] bg-transparent py-3 text-sm outline-none focus:border-[#1F1D1A]"
                  />

                  <p className="mt-2 text-[10px] tracking-[0.08em] text-[#4B4A47]">
                    /news/{slug}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="excerpt"
                    className="text-[10px] font-bold tracking-[0.16em]"
                  >
                    EXCERPT
                  </label>

                  <textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(event) =>
                      setExcerpt(
                        event.target.value
                      )
                    }
                    rows={4}
                    className="mt-3 w-full resize-none border border-[#CBC9C0] bg-transparent px-4 py-4 text-sm leading-7 outline-none focus:border-[#1F1D1A]"
                  />
                </div>
              </div>
            </section>

            <section className="border-b border-[#CBC9C0] pb-10">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                CONTENT CLASSIFICATION
              </div>

              <div className="mt-6 grid gap-8 lg:grid-cols-2">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.16em]">
                    CATEGORIES
                  </div>

                  <div className="mt-4 border border-[#CBC9C0]">
                    {categories.map(
                      (
                        category,
                        index
                      ) => (
                        <label
                          key={
                            category.id
                          }
                          className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm transition hover:bg-[#ECE9D2] ${
                            index !== 0
                              ? "border-t border-[#CBC9C0]"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={categoryIds.includes(
                              category.id
                            )}
                            onChange={() =>
                              toggleCategory(
                                category.id
                              )
                            }
                            className="h-4 w-4 accent-[#1F1D1A]"
                          />

                          <span>
                            {
                              category.name
                            }
                          </span>
                        </label>
                      )
                    )}
                  </div>

                  <p className="mt-2 text-[10px] tracking-[0.08em] text-[#4B4A47]">
                    Select all categories
                    that apply.
                  </p>
                </div>

                <div>
                  <div className="text-[10px] font-bold tracking-[0.16em]">
                    TAGS
                  </div>

                  <div className="mt-4 border border-[#CBC9C0]">
                    {tags.map(
                      (tag, index) => (
                        <label
                          key={tag.id}
                          className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm transition hover:bg-[#ECE9D2] ${
                            index !== 0
                              ? "border-t border-[#CBC9C0]"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={tagIds.includes(
                              tag.id
                            )}
                            onChange={() =>
                              toggleTag(
                                tag.id
                              )
                            }
                            className="h-4 w-4 accent-[#1F1D1A]"
                          />

                          <span>
                            {tag.name}
                          </span>
                        </label>
                      )
                    )}
                  </div>

                  <p className="mt-2 text-[10px] tracking-[0.08em] text-[#4B4A47]">
                    Select all tags
                    that apply.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-b border-[#CBC9C0] pb-10">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                STORY CONTENT
              </div>

              <div className="mt-6">
                <label
                  htmlFor="content"
                  className="text-[10px] font-bold tracking-[0.16em]"
                >
                  CONTENT
                </label>

                <textarea
                  id="content"
                  value={content}
                  onChange={(event) =>
                    setContent(
                      event.target.value
                    )
                  }
                  rows={18}
                  className="mt-3 w-full resize-y border border-[#CBC9C0] bg-transparent px-5 py-5 text-base leading-8 outline-none focus:border-[#1F1D1A]"
                />
              </div>
            </section>

            <section>
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                    WORKFLOW
                  </div>

                  <div className="mt-2 text-sm text-[#4B4A47]">
                    Current status:{" "}
                    {article?.status ??
                      "DRAFT"}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="/admin/articles"
                    className="border border-[#CBC9C0] px-6 py-4 text-[10px] font-bold tracking-[0.16em] transition hover:border-[#1F1D1A]"
                  >
                    CANCEL
                  </a>

                  {article && (
                    <a
                      href={`/news/${article.slug}`}
                      className="border border-[#CBC9C0] px-6 py-4 text-[10px] font-bold tracking-[0.16em] transition hover:border-[#1F1D1A]"
                    >
                      VIEW
                    </a>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="border border-[#1F1D1A] bg-[#1F1D1A] px-7 py-4 text-[10px] font-bold tracking-[0.16em] text-[#FFFAEB] transition hover:border-[#B88A3B] hover:bg-[#B88A3B] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "SAVING..."
                      : "SAVE CHANGES"}
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