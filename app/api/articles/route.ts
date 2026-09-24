import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET() {
  try {
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

    return NextResponse.json(articles);
  } catch (error) {
    console.error("GET /api/articles failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch articles",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const gameId = Number(body.gameId);
    const title = String(body.title ?? "").trim();
    const slug = String(body.slug ?? "").trim();
    const excerpt = String(body.excerpt ?? "").trim();
    const content = String(body.content ?? "").trim();

    if (!gameId || !title || !slug || !content) {
      return NextResponse.json(
        {
          error: "Game, title, slug and content are required.",
        },
        { status: 400 }
      );
    }

    const existingArticles = await db.orm.public.Article
      .select("id", "slug")
      .all();

    const slugExists = existingArticles.some(
      (article) => article.slug === slug
    );

    if (slugExists) {
      return NextResponse.json(
        {
          error: "An article with this slug already exists.",
        },
        { status: 409 }
      );
    }

    const games = await db.orm.public.Game
      .select("id", "name", "slug")
      .all();

    const gameExists = games.some((game) => game.id === gameId);

    if (!gameExists) {
      return NextResponse.json(
        {
          error: "Selected game does not exist.",
        },
        { status: 400 }
      );
    }

    const article = await db.orm.public.Article
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
      .create({
        gameId,
        title,
        slug,
        excerpt: excerpt || null,
        content,
        status: "DRAFT",
      });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("POST /api/articles failed:", error);

    return NextResponse.json(
      {
        error: "Failed to create article.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}