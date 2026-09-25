import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

type ProjectParams = { id: string };

async function getProjectId(params: Promise<ProjectParams> | ProjectParams) {
  const resolved = await params;
  return Number(resolved.id);
}

export async function GET(
  request: Request,
  context: { params: Promise<ProjectParams> }
) {
  try {
    const projectId = await getProjectId(context.params);

    if (!Number.isInteger(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID." },
        { status: 400 }
      );
    }

    const rows = (await db.orm.public.ResearchProject.select(
      "id",
      "gameId",
      "title",
      "slug",
      "researchQuestion",
      "objective",
      "status",
      "startedAt",
      "completedAt",
      "createdAt",
      "updatedAt"
    ).all()) as any[];

    const project = rows.find((row: any) => row.id === projectId);

    if (!project) {
      return NextResponse.json(
        { error: "Research project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("GET research project failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch research project." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<ProjectParams> }
) {
  try {
    const projectId = await getProjectId(context.params);
    const body = await request.json();

    if (!Number.isInteger(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID." },
        { status: 400 }
      );
    }

    const rows = (await db.orm.public.ResearchProject.select(
      "id",
      "slug"
    ).all()) as any[];

    const current = rows.find((row: any) => row.id === projectId);

    if (!current) {
      return NextResponse.json(
        { error: "Research project not found." },
        { status: 404 }
      );
    }

    const gameId = Number(body.gameId);
    const title = String(body.title ?? "").trim();
    const slug = String(body.slug ?? "").trim();
    const researchQuestion = String(body.researchQuestion ?? "").trim();
    const objective = String(body.objective ?? "").trim();
    const status = String(body.status ?? "DRAFT").trim();

    if (!gameId || !title || !slug) {
      return NextResponse.json(
        { error: "Game, title, and slug are required." },
        { status: 400 }
      );
    }

    if (rows.some((row: any) => row.slug === slug && row.id !== projectId)) {
      return NextResponse.json(
        { error: "A research project with this slug already exists." },
        { status: 409 }
      );
    }

    const updatedProject = await (
      db.orm.public.ResearchProject
        .select(
          "id",
          "gameId",
          "title",
          "slug",
          "researchQuestion",
          "objective",
          "status",
          "startedAt",
          "completedAt",
          "createdAt",
          "updatedAt"
        )
        .where({ id: projectId } as any) as any
    ).update({
      gameId,
      title,
      slug,
      researchQuestion: researchQuestion || null,
      objective: objective || null,
      status: status || "DRAFT",
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("PUT research project failed:", error);
    return NextResponse.json(
      { error: "Failed to update research project." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<ProjectParams> }
) {
  try {
    const projectId = await getProjectId(context.params);

    if (!Number.isInteger(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID." },
        { status: 400 }
      );
    }

    const existing = (await db.orm.public.ResearchProject
      .select("id")
      .all()) as any[];

    if (!existing.some((row: any) => row.id === projectId)) {
      return NextResponse.json(
        { error: "Research project not found." },
        { status: 404 }
      );
    }

    await (
      db.orm.public.ResearchEvidence
        .select("id")
        .where({ researchProjectId: projectId } as any) as any
    ).delete();

    await (
      db.orm.public.ResearchClaim
        .select("id")
        .where({ researchProjectId: projectId } as any) as any
    ).delete();

    await (
      db.orm.public.ResearchProjectSource
        .where({ researchProjectId: projectId } as any) as any
    ).delete();

    await (
      db.orm.public.ResearchProject
        .select("id")
        .where({ id: projectId } as any) as any
    ).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE research project failed:", error);
    return NextResponse.json(
      { error: "Failed to delete research project." },
      { status: 500 }
    );
  }
}