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
    const tagId = Number(id);

    if (!Number.isInteger(tagId)) {
      return NextResponse.json(
        { error: "Invalid tag ID." },
        { status: 400 }
      );
    }

    const tags = await db.orm.public.Tag
      .select(
        "id",
        "name",
        "slug",
        "createdAt"
      )
      .all();

    const tag = tags.find(
      (item) => item.id === tagId
    );

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error(
      "GET /api/admin/tags/[id] failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch tag.",
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
    const tagId = Number(id);

    if (!Number.isInteger(tagId)) {
      return NextResponse.json(
        { error: "Invalid tag ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const slug = String(body.slug ?? "").trim();

    if (!name || !slug) {
      return NextResponse.json(
        {
          error: "Tag name and slug are required.",
        },
        { status: 400 }
      );
    }

    const tags = await db.orm.public.Tag
      .select(
        "id",
        "name",
        "slug"
      )
      .all();

    const currentTag = tags.find(
      (tag) => tag.id === tagId
    );

    if (!currentTag) {
      return NextResponse.json(
        { error: "Tag not found." },
        { status: 404 }
      );
    }

    const slugExists = tags.some(
      (tag) =>
        tag.slug === slug &&
        tag.id !== tagId
    );

    if (slugExists) {
      return NextResponse.json(
        {
          error: "A tag with this slug already exists.",
        },
        { status: 409 }
      );
    }

    const updatedTag = await db.orm.public.Tag
      .select(
        "id",
        "name",
        "slug",
        "createdAt"
      )
      .where({ id: tagId })
      .update({
        name,
        slug,
      });

    if (!updatedTag) {
      return NextResponse.json(
        { error: "Tag could not be updated." },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error(
      "PUT /api/admin/tags/[id] failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update tag.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}