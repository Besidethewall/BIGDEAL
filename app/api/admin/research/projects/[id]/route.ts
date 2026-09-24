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
    const projectId = Number(id);

    if (!Number.isInteger(projectId)) {
      return NextResponse.json({ error: "Invalid project ID." }, { status: 400 });
    }

    const projects = await db.orm.public.ResearchProject
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
      .all();

    const project = projects.find((item) => item.id === projectId);

    if (!project) {
      return NextResponse.json({ error: "Research project not found." }, { status: 404 });
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
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);
    const body = await request.json();

    if (!Number.isInteger(projectId)) {
      return NextResponse.json({ error: "Invalid project ID." }, { status: 400 });
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

    const projects = await db.orm.public.ResearchProject
      .select("id", "slug")
      .all();

    const currentProject = projects.find((project) => project.id === projectId);

    if (!currentProject) {
      return NextResponse.json({ error: "Research project not found." }, { status: 404 });
    }

    if (projects.some((project) => project.slug === slug && project.id !== projectId)) {
      return NextResponse.json(
        { error: "A research project with this slug already exists." },
        { status: 409 }
      );
    }

    const updatedProject = await db.orm.public.ResearchProject
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
      .where({ id: projectId })
      .update({
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
