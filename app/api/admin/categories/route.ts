import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET() {
  try {
    const categories = await db.orm.public.Category
      .select(
        "id",
        "name",
        "slug",
        "description",
        "createdAt",
        "updatedAt"
      )
      .all();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/admin/categories failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch categories.",
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

    if (!name || !slug) {
      return NextResponse.json(
        {
          error: "Category name and slug are required.",
        },
        { status: 400 }
      );
    }

    const categories = await db.orm.public.Category
      .select("id", "name", "slug")
      .all();

    const slugExists = categories.some(
      (category) => category.slug === slug
    );

    if (slugExists) {
      return NextResponse.json(
        {
          error: "A category with this slug already exists.",
        },
        { status: 409 }
      );
    }

    const category = await db.orm.public.Category
      .select(
        "id",
        "name",
        "slug",
        "description",
        "createdAt",
        "updatedAt"
      )
      .create({
        name,
        slug,
        description: description || null,
      });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/categories failed:", error);

    return NextResponse.json(
      {
        error: "Failed to create category.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}