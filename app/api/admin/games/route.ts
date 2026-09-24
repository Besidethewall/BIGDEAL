import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET() {
  try {
    const games = await db.orm.public.Game
      .select(
        "id",
        "name",
        "slug",
        "description",
        "logo",
        "isActive",
        "createdAt",
        "updatedAt"
      )
      .all();

    return NextResponse.json(games);
  } catch (error) {
    console.error("GET /api/admin/games failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch games.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const slug = String(body.slug ?? "").trim();
    const description = String(body.description ?? "").trim();
    const logo = String(body.logo ?? "").trim();

    const isActive =
      typeof body.isActive === "boolean"
        ? body.isActive
        : true;

    if (!name || !slug) {
      return NextResponse.json(
        {
          error: "Game name and slug are required.",
        },
        { status: 400 }
      );
    }

    const games = await db.orm.public.Game
      .select("id", "name", "slug")
      .all();

    const slugExists = games.some(
      (game) => game.slug === slug
    );

    if (slugExists) {
      return NextResponse.json(
        {
          error: "A game with this slug already exists.",
        },
        { status: 409 }
      );
    }

    const game = await db.orm.public.Game
      .select(
        "id",
        "name",
        "slug",
        "description",
        "logo",
        "isActive",
        "createdAt",
        "updatedAt"
      )
      .create({
        name,
        slug,
        description: description || null,
        logo: logo || null,
        isActive,
      });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/games failed:", error);

    return NextResponse.json(
      {
        error: "Failed to create game.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}