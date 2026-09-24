"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/admin/categories");

        if (!response.ok) {
          throw new Error(
            `Failed to fetch categories: ${response.status}`
          );
        }

        const data: Category[] = await response.json();

        setCategories(data);
      } catch (error) {
        console.error("Categories page failed:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load categories."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <header className="border-b border-[#CBC9C0] pb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] text-[#B88A3B]">
                ADMIN / CATEGORIES
              </p>

              <h1 className="mt-3 font-serif text-4xl tracking-[-0.02em]">
                Categories
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4B4A47]">
                Manage the global editorial categories used across
                BIGDEAL articles.
              </p>
            </div>

            <Link
              href="/admin/categories/new"
              className="inline-flex items-center justify-center border border-[#1F1D1A] px-5 py-3 text-[11px] font-bold tracking-[0.16em] transition hover:bg-[#1F1D1A] hover:text-[#FFFAEB]"
            >
              ADD CATEGORY
            </Link>
          </div>
        </header>

        <section className="mt-8">
          {loading && (
            <div className="border-y border-[#CBC9C0] py-8 text-sm text-[#4B4A47]">
              Loading categories...
            </div>
          )}

          {!loading && error && (
            <div className="border border-[#CBC9C0] bg-[#ECE9D2] p-6">
              <p className="text-sm font-semibold">
                Unable to load categories.
              </p>

              <p className="mt-2 text-sm text-[#4B4A47]">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[11px] font-bold tracking-[0.14em] text-[#4B4A47]">
                  {categories.length}{" "}
                  {categories.length === 1
                    ? "CATEGORY"
                    : "CATEGORIES"}
                </p>
              </div>

              <div className="overflow-x-auto border-y border-[#CBC9C0]">
                <table className="w-full min-w-[850px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#CBC9C0] text-left">
                      <th className="px-4 py-4 text-[10px] font-bold tracking-[0.16em]">
                        NAME
                      </th>

                      <th className="px-4 py-4 text-[10px] font-bold tracking-[0.16em]">
                        SLUG
                      </th>

                      <th className="px-4 py-4 text-[10px] font-bold tracking-[0.16em]">
                        DESCRIPTION
                      </th>

                      <th className="px-4 py-4 text-[10px] font-bold tracking-[0.16em]">
                        CREATED
                      </th>

                      <th className="px-4 py-4 text-right text-[10px] font-bold tracking-[0.16em]">
                        ACTION
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {categories.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b border-[#CBC9C0] last:border-b-0"
                      >
                        <td className="px-4 py-5">
                          <div className="font-serif text-lg">
                            {category.name}
                          </div>

                          <div className="mt-1 text-[10px] tracking-[0.12em] text-[#4B4A47]">
                            CATEGORY #{category.id}
                          </div>
                        </td>

                        <td className="px-4 py-5 text-sm text-[#4B4A47]">
                          /{category.slug}
                        </td>

                        <td className="max-w-md px-4 py-5 text-sm leading-6 text-[#4B4A47]">
                          {category.description || "—"}
                        </td>

                        <td className="px-4 py-5 text-sm text-[#4B4A47]">
                          {formatDate(category.createdAt)}
                        </td>

                        <td className="px-4 py-5 text-right">
                          <Link
                            href={`/admin/categories/${category.id}`}
                            className="text-[10px] font-bold tracking-[0.16em] text-[#1F1D1A] underline decoration-[#B88A3B] decoration-2 underline-offset-4 transition hover:text-[#B88A3B]"
                          >
                            EDIT
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {categories.length === 0 && (
                <div className="border-b border-[#CBC9C0] py-12 text-center">
                  <p className="font-serif text-2xl">
                    No categories yet.
                  </p>

                  <p className="mt-2 text-sm text-[#4B4A47]">
                    Create your first editorial category.
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}