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
    const categoryId = Number(id);

    if (!Number.isInteger(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID." },
        { status: 400 }
      );
    }

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

    const category = categories.find(
      (item) => item.id === categoryId
    );

    if (!category) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("GET /api/admin/categories/[id] failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch category.",
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
    const categoryId = Number(id);

    if (!Number.isInteger(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID." },
        { status: 400 }
      );
    }

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
      .select(
        "id",
        "name",
        "slug",
        "description",
        "createdAt",
        "updatedAt"
      )
      .all();

    const currentCategory = categories.find(
      (category) => category.id === categoryId
    );

    if (!currentCategory) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    const slugExists = categories.some(
      (category) =>
        category.slug === slug &&
        category.id !== categoryId
    );

    if (slugExists) {
      return NextResponse.json(
        {
          error: "A category with this slug already exists.",
        },
        { status: 409 }
      );
    }

    const updatedCategory = await db.orm.public.Category
      .select(
        "id",
        "name",
        "slug",
        "description",
        "createdAt",
        "updatedAt"
      )
      .where({ id: categoryId })
      .update({
        name,
        slug,
        description: description || null,
      });

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category could not be updated." },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error(
      "PUT /api/admin/categories/[id] failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update category.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}