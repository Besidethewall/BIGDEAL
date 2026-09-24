import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseIdArray(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value
        .map((item) => Number(item))
        .filter(
          (item) =>
            Number.isInteger(item) &&
            item > 0
        )
    ),
  ];
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const articleId = Number(id);

    if (!Number.isInteger(articleId)) {
      return NextResponse.json(
        { error: "Invalid article ID." },
        { status: 400 }
      );
    }

    const articles =
      await db.orm.public.Article
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

    const article = articles.find(
      (item) => item.id === articleId
    );

    if (!article) {
      return NextResponse.json(
        { error: "Article not found." },
        { status: 404 }
      );
    }

    const categoryRelations =
      await db.orm.public.ArticleCategory
        .select(
          "articleId",
          "categoryId"
        )
        .all();

    const tagRelations =
      await db.orm.public.ArticleTag
        .select(
          "articleId",
          "tagId"
        )
        .all();

    const categoryIds =
      categoryRelations
        .filter(
          (relation) =>
            relation.articleId === articleId
        )
        .map(
          (relation) =>
            relation.categoryId
        );

    const tagIds =
      tagRelations
        .filter(
          (relation) =>
            relation.articleId === articleId
        )
        .map(
          (relation) =>
            relation.tagId
        );

    return NextResponse.json({
      ...article,
      categoryIds,
      tagIds,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/articles/[id] failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch article.",
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
    const articleId = Number(id);

    if (!Number.isInteger(articleId)) {
      return NextResponse.json(
        { error: "Invalid article ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const gameId = Number(body.gameId);

    const patchId =
      body.patchId === null ||
      body.patchId === "" ||
      typeof body.patchId === "undefined"
        ? null
        : Number(body.patchId);

    const title =
      String(body.title ?? "").trim();

    const slug =
      String(body.slug ?? "").trim();

    const excerpt =
      String(body.excerpt ?? "").trim();

    const content =
      String(body.content ?? "").trim();

    const categoryIds =
      parseIdArray(body.categoryIds);

    const tagIds =
      parseIdArray(body.tagIds);

    if (
      !gameId ||
      !title ||
      !slug ||
      !content
    ) {
      return NextResponse.json(
        {
          error:
            "Game, title, slug and content are required.",
        },
        { status: 400 }
      );
    }

    if (
      patchId !== null &&
      (!Number.isInteger(patchId) ||
        patchId <= 0)
    ) {
      return NextResponse.json(
        {
          error: "Invalid patch ID.",
        },
        { status: 400 }
      );
    }

    const articles =
      await db.orm.public.Article
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

    const currentArticle =
      articles.find(
        (article) =>
          article.id === articleId
      );

    if (!currentArticle) {
      return NextResponse.json(
        { error: "Article not found." },
        { status: 404 }
      );
    }

    const slugExists =
      articles.some(
        (article) =>
          article.slug === slug &&
          article.id !== articleId
      );

    if (slugExists) {
      return NextResponse.json(
        {
          error:
            "An article with this slug already exists.",
        },
        { status: 409 }
      );
    }

    const games =
      await db.orm.public.Game
        .select(
          "id",
          "name",
          "slug"
        )
        .all();

    const gameExists =
      games.some(
        (game) =>
          game.id === gameId
      );

    if (!gameExists) {
      return NextResponse.json(
        {
          error:
            "Selected game does not exist.",
        },
        { status: 400 }
      );
    }

    if (patchId !== null) {
      const patches =
        await db.orm.public.Patch
          .select(
            "id",
            "gameId",
            "version",
            "title"
          )
          .all();

      const selectedPatch =
        patches.find(
          (patch) =>
            patch.id === patchId
        );

      if (!selectedPatch) {
        return NextResponse.json(
          {
            error:
              "Selected patch does not exist.",
          },
          { status: 400 }
        );
      }

      if (
        selectedPatch.gameId !==
        gameId
      ) {
        return NextResponse.json(
          {
            error:
              "Selected patch does not belong to the selected game.",
          },
          { status: 400 }
        );
      }
    }

    const categories =
      await db.orm.public.Category
        .select(
          "id",
          "name",
          "slug"
        )
        .all();

    const invalidCategoryIds =
      categoryIds.filter(
        (categoryId) =>
          !categories.some(
            (category) =>
              category.id ===
              categoryId
          )
      );

    if (
      invalidCategoryIds.length > 0
    ) {
      return NextResponse.json(
        {
          error:
            "One or more selected categories do not exist.",
          invalidCategoryIds,
        },
        { status: 400 }
      );
    }

    const tags =
      await db.orm.public.Tag
        .select(
          "id",
          "name",
          "slug"
        )
        .all();

    const invalidTagIds =
      tagIds.filter(
        (tagId) =>
          !tags.some(
            (tag) =>
              tag.id === tagId
          )
      );

    if (
      invalidTagIds.length > 0
    ) {
      return NextResponse.json(
        {
          error:
            "One or more selected tags do not exist.",
          invalidTagIds,
        },
        { status: 400 }
      );
    }

    const updatedArticle =
      await db.orm.public.Article
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
        .where({ id: articleId })
        .update({
          gameId,
          patchId,
          title,
          slug,
          excerpt:
            excerpt || null,
          content,
        });

    if (!updatedArticle) {
      return NextResponse.json(
        {
          error:
            "Article could not be updated.",
        },
        { status: 500 }
      );
    }

    /*
     * CATEGORY RELATIONS
     *
     * Remove the current relations for this
     * article, then recreate them from the
     * submitted categoryIds.
     */

    const existingCategoryRelations =
      await db.orm.public.ArticleCategory
        .select(
          "articleId",
          "categoryId"
        )
        .all();

    const articleCategoryRelations =
      existingCategoryRelations.filter(
        (relation) =>
          relation.articleId ===
          articleId
      );

    for (
      const relation of
        articleCategoryRelations
    ) {
      await db.orm.public.ArticleCategory
        .where({
          articleId,
          categoryId:
            relation.categoryId,
        })
        .delete();
    }

    for (
      const categoryId of categoryIds
    ) {
      await db.orm.public.ArticleCategory
        .select(
          "articleId",
          "categoryId"
        )
        .create({
          articleId,
          categoryId,
        });
    }

    /*
     * TAG RELATIONS
     *
     * Remove the current relations for this
     * article, then recreate them from the
     * submitted tagIds.
     */

    const existingTagRelations =
      await db.orm.public.ArticleTag
        .select(
          "articleId",
          "tagId"
        )
        .all();

    const articleTagRelations =
      existingTagRelations.filter(
        (relation) =>
          relation.articleId ===
          articleId
      );

    for (
      const relation of
        articleTagRelations
    ) {
      await db.orm.public.ArticleTag
        .where({
          articleId,
          tagId:
            relation.tagId,
        })
        .delete();
    }

    for (
      const tagId of tagIds
    ) {
      await db.orm.public.ArticleTag
        .select(
          "articleId",
          "tagId"
        )
        .create({
          articleId,
          tagId,
        });
    }

    return NextResponse.json({
      ...updatedArticle,
      categoryIds,
      tagIds,
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/articles/[id] failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update article.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}