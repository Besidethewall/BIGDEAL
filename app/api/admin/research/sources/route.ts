import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET(request: Request) {
  try {
    const projectId = Number(
      new URL(request.url).searchParams.get("projectId")
    );

    const sources = await db.orm.public.ResearchSource
      .select(
        "id",
        "title",
        "url",
        "canonicalUrl",
        "publisher",
        "author",
        "sourceType",
        "publishedAt",
        "accessedAt",
        "language",
        "summary",
        "reliability",
        "createdAt",
        "updatedAt"
      )
      .all();

    if (!projectId) {
      return NextResponse.json(sources);
    }

    const links = await db.orm.public.ResearchProjectSource
      .select("researchProjectId", "sourceId")
      .all();

    const sourceIds = links
      .filter((link) => link.researchProjectId === projectId)
      .map((link) => link.sourceId);

    return NextResponse.json(
      sources.filter((source) => sourceIds.includes(source.id))
    );
  } catch (error) {
    console.error("GET research sources failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch research sources." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const projectId = Number(body.projectId);
    const title = String(body.title ?? "").trim();
    const url = String(body.url ?? "").trim();
    const sourceType = String(body.sourceType ?? "WEB").trim();
    const publisher = String(body.publisher ?? "").trim();
    const author = String(body.author ?? "").trim();
    const summary = String(body.summary ?? "").trim();

    if (!projectId || !title || !url) {
      return NextResponse.json(
        { error: "Project, title, and URL are required." },
        { status: 400 }
      );
    }

    const projects = await db.orm.public.ResearchProject
      .select("id")
      .all();

    if (!projects.some((project) => project.id === projectId)) {
      return NextResponse.json(
        { error: "Research project does not exist." },
        { status: 400 }
      );
    }

    const existingSources = await db.orm.public.ResearchSource
      .select("id", "url")
      .all();

    const existingSource = existingSources.find(
      (source) => source.url === url
    );

    const source = existingSource
      ? existingSource
      : await db.orm.public.ResearchSource
          .select(
            "id",
            "title",
            "url",
            "sourceType",
            "publisher",
            "author",
            "summary"
          )
          .create({
            title,
            url,
            sourceType,
            publisher: publisher || null,
            author: author || null,
            summary: summary || null,
          });

    const links = await db.orm.public.ResearchProjectSource
      .select("researchProjectId", "sourceId")
      .all();

    if (
      links.some(
        (link) =>
          link.researchProjectId === projectId &&
          link.sourceId === source.id
      )
    ) {
      return NextResponse.json(
        { error: "This source is already attached to the project." },
        { status: 409 }
      );
    }

    await db.orm.public.ResearchProjectSource.create({
      researchProjectId: projectId,
      sourceId: source.id,
      role: String(body.role ?? "SECONDARY").trim(),
      relevance: String(body.relevance ?? "").trim() || null,
    });

    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    console.error("POST research source failed:", error);
    return NextResponse.json(
      {
        error: "Failed to create research source.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

