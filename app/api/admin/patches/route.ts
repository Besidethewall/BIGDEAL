import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET() {
  try {
    const patches = await db.orm.public.Patch
      .select(
        "id",
        "gameId",
        "version",
        "title",
        "description",
        "releaseDate",
        "createdAt",
        "updatedAt"
      )
      .all();

    return NextResponse.json(patches);
  } catch (error) {
    console.error("GET /api/admin/patches failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch patches.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const gameId = Number(body.gameId);
    const version = String(body.version ?? "").trim();
    const title = String(body.title ?? "").trim();
    const description = String(
      body.description ?? ""
    ).trim();

    const releaseDateValue = String(
      body.releaseDate ?? ""
    ).trim();

    if (
      !Number.isInteger(gameId) ||
      gameId <= 0
    ) {
      return NextResponse.json(
        {
          error: "A valid game ID is required.",
        },
        { status: 400 }
      );
    }

    if (!version || !title) {
      return NextResponse.json(
        {
          error: "Patch version and title are required.",
        },
        { status: 400 }
      );
    }

    const games = await db.orm.public.Game
      .select("id", "name", "slug")
      .all();

    const gameExists = games.some(
      (game) => game.id === gameId
    );

    if (!gameExists) {
      return NextResponse.json(
        {
          error: "Game not found.",
        },
        { status: 404 }
      );
    }

    const patches = await db.orm.public.Patch
      .select(
        "id",
        "gameId",
        "version"
      )
      .all();

    const duplicatePatch = patches.some(
      (patch) =>
        patch.gameId === gameId &&
        patch.version === version
    );

    if (duplicatePatch) {
      return NextResponse.json(
        {
          error:
            "A patch with this version already exists for this game.",
        },
        { status: 409 }
      );
    }

    let releaseDate = null;

    if (releaseDateValue) {
      const parsedDate = new Date(
        releaseDateValue
      );

      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          {
            error: "Invalid release date.",
          },
          { status: 400 }
        );
      }

      releaseDate = parsedDate.toISOString();
    }

    const patch = await db.orm.public.Patch
      .select(
        "id",
        "gameId",
        "version",
        "title",
        "description",
        "releaseDate",
        "createdAt",
        "updatedAt"
      )
      .create({
        gameId,
        version,
        title,
        description: description || null,
        releaseDate,
      });

    return NextResponse.json(
      patch,
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/admin/patches failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create patch.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}