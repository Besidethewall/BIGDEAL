import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const articles = await db.orm.public.Article
      .select(
        "id",
        "gameId",
        "patchId",
        "title",
        "slug",
        "excerpt",
        "content",
        "featuredImage",
        "status",
        "publishedAt",
        "createdAt",
        "updatedAt"
      )
      .all();

    const article = articles.find((item) => item.slug === slug);

    if (!article) {
      return NextResponse.json(
        {
          error: "Article not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("GET /api/articles/[slug] failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch article",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}