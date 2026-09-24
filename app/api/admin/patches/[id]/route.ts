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
    const patchId = Number(id);

    if (!Number.isInteger(patchId)) {
      return NextResponse.json(
        { error: "Invalid patch ID." },
        { status: 400 }
      );
    }

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

    const patch = patches.find(
      (item) => item.id === patchId
    );

    if (!patch) {
      return NextResponse.json(
        { error: "Patch not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(patch);
  } catch (error) {
    console.error(
      "GET /api/admin/patches/[id] failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch patch.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
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
    const patchId = Number(id);

    if (!Number.isInteger(patchId)) {
      return NextResponse.json(
        { error: "Invalid patch ID." },
        { status: 400 }
      );
    }

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

    const patches = await db.orm.public.Patch
      .select(
        "id",
        "gameId",
        "version"
      )
      .all();

    const currentPatch = patches.find(
      (patch) => patch.id === patchId
    );

    if (!currentPatch) {
      return NextResponse.json(
        { error: "Patch not found." },
        { status: 404 }
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

    const duplicatePatch = patches.some(
      (patch) =>
        patch.id !== patchId &&
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

    const updatedPatch = await db.orm.public.Patch
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
      .where({ id: patchId })
      .update({
        gameId,
        version,
        title,
        description: description || null,
        releaseDate,
      });

    if (!updatedPatch) {
      return NextResponse.json(
        {
          error: "Patch could not be updated.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedPatch);
  } catch (error) {
    console.error(
      "PUT /api/admin/patches/[id] failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update patch.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}