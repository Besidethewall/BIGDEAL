"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
};

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      try {
        const { slug } = await params;

        const response = await fetch(
          `/api/articles/${encodeURIComponent(slug)}`
        );

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }

        const data: Article = await response.json();

        setArticle(data);
      } catch (error) {
        console.error("Article page failed:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
        <div className="mx-auto max-w-[1000px] px-6 py-24 lg:px-10">
          <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
            BIGDEAL
          </div>

          <p className="mt-8 text-sm text-[#4B4A47]">
            Loading article...
          </p>
        </div>
      </main>
    );
  }

  if (notFound || !article) {
    return (
      <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
        <div className="mx-auto max-w-[1000px] px-6 py-24 lg:px-10">
          <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
            BIGDEAL
          </div>

          <h1 className="mt-6 font-serif text-5xl tracking-[-0.04em]">
            Article not found.
          </h1>

          <Link
            href="/"
            className="mt-8 inline-block border-b border-[#1F1D1A] pb-1 text-[10px] font-bold tracking-[0.16em]"
          >
            BACK TO BIGDEAL
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFAEB] text-[#1F1D1A]">
      <header className="border-b border-[#CBC9C0]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="flex min-h-[88px] items-center justify-between">
            <Link href="/" className="block">
              <div className="text-3xl font-black tracking-[-0.05em]">
                BIGDEAL
              </div>

              <div className="mt-1 text-[9px] font-semibold tracking-[0.24em] text-[#4B4A47]">
                NEWS & INTELLIGENCE
              </div>
            </Link>

            <Link
              href="/"
              className="text-[10px] font-bold tracking-[0.16em] text-[#4B4A47] transition hover:text-[#B88A3B]"
            >
              BACK TO HOME
            </Link>
          </div>
        </div>
      </header>

      <article>
        <section className="border-b border-[#CBC9C0]">
          <div className="mx-auto max-w-[1100px] px-6 py-16 lg:px-10 lg:py-24">
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
              NEWS
            </div>

            <h1 className="mt-6 max-w-5xl font-serif text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mt-8 max-w-3xl text-lg leading-8 text-[#4B4A47] lg:text-xl">
                {article.excerpt}
              </p>
            )}

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#CBC9C0] pt-5 text-[9px] font-semibold tracking-[0.16em] text-[#4B4A47]">
              <span>BIGDEAL</span>
              <span>{article.status}</span>
              <span>DEMO CONTENT</span>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-[900px] px-6 py-14 lg:px-10 lg:py-20">
            <div className="mb-12 border-l-2 border-[#B88A3B] pl-5">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                WHAT WE KNOW
              </div>

              <p className="mt-3 text-sm leading-7 text-[#4B4A47]">
                This is a BIGDEAL demonstration article. It is used to test
                the editorial publishing system and is not a real news report.
              </p>
            </div>

            <div className="border-b border-[#CBC9C0] pb-12">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                THE STORY
              </div>

              <div className="mt-6 whitespace-pre-line text-base leading-8 text-[#1F1D1A] lg:text-lg lg:leading-9">
                {article.content}
              </div>
            </div>

            <div className="grid gap-10 border-b border-[#CBC9C0] py-12 sm:grid-cols-2">
              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                  THE CONTEXT
                </div>

                <p className="mt-4 text-sm leading-7 text-[#4B4A47]">
                  BIGDEAL articles will place important updates inside their
                  wider game, community and system context.
                </p>
              </div>

              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                  OUR ANALYSIS
                </div>

                <p className="mt-4 text-sm leading-7 text-[#4B4A47]">
                  Editorial analysis will be separated from verified facts and
                  clearly identified when an article is published.
                </p>
              </div>
            </div>

            <section className="pt-12">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#B88A3B]">
                SOURCES
              </div>

              <div className="mt-5 border-t border-[#CBC9C0] pt-5">
                <p className="text-sm leading-7 text-[#4B4A47]">
                  Sources and citations will appear here when the article is
                  based on external research.
                </p>
              </div>
            </section>
          </div>
        </section>
      </article>

      <footer className="border-t border-[#CBC9C0]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-10 lg:px-10">
          <div>
            <div className="text-xl font-black tracking-[-0.04em]">
              BIGDEAL
            </div>

            <div className="mt-1 text-[9px] tracking-[0.18em] text-[#4B4A47]">
              MMORPG NEWS & INTELLIGENCE
            </div>
          </div>

          <Link
            href="/"
            className="text-[9px] font-bold tracking-[0.16em] text-[#4B4A47] hover:text-[#B88A3B]"
          >
            HOME
          </Link>
        </div>
      </footer>
    </main>
  );
}