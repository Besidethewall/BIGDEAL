import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET() {
  try {
    const tags = await db.orm.public.Tag
      .select(
        "id",
        "name",
        "slug",
        "createdAt"
      )
      .all();

    return NextResponse.json(tags);
  } catch (error) {
    console.error("GET /api/admin/tags failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch tags.",
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

    if (!name || !slug) {
      return NextResponse.json(
        {
          error: "Tag name and slug are required.",
        },
        { status: 400 }
      );
    }

    const tags = await db.orm.public.Tag
      .select("id", "name", "slug")
      .all();

    const slugExists = tags.some(
      (tag) => tag.slug === slug
    );

    if (slugExists) {
      return NextResponse.json(
        {
          error: "A tag with this slug already exists.",
        },
        { status: 409 }
      );
    }

    const tag = await db.orm.public.Tag
      .select(
        "id",
        "name",
        "slug",
        "createdAt"
      )
      .create({
        name,
        slug,
      });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/tags failed:", error);

    return NextResponse.json(
      {
        error: "Failed to create tag.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}