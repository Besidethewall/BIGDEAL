import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const gameId = Number(id);

    if (!Number.isInteger(gameId)) {
      return NextResponse.json(
        { error: "Invalid game ID." },
        { status: 400 }
      );
    }

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

    const game = games.find((item) => item.id === gameId);

    if (!game) {
      return NextResponse.json(
        { error: "Game not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("GET /api/admin/games/[id] failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch game.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const gameId = Number(id);

    if (!Number.isInteger(gameId)) {
      return NextResponse.json(
        { error: "Invalid game ID." },
        { status: 400 }
      );
    }

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

    const currentGame = games.find(
      (game) => game.id === gameId
    );

    if (!currentGame) {
      return NextResponse.json(
        { error: "Game not found." },
        { status: 404 }
      );
    }

    const slugExists = games.some(
      (game) =>
        game.slug === slug &&
        game.id !== gameId
    );

    if (slugExists) {
      return NextResponse.json(
        {
          error: "A game with this slug already exists.",
        },
        { status: 409 }
      );
    }

    const updatedGame = await db.orm.public.Game
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
      .where({ id: gameId })
      .update({
        name,
        slug,
        description: description || null,
        logo: logo || null,
        isActive,
      });

    if (!updatedGame) {
      return NextResponse.json(
        { error: "Game could not be updated." },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error("PUT /api/admin/games/[id] failed:", error);

    return NextResponse.json(
      {
        error: "Failed to update game.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}