import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET() {
  try {
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

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/admin/research/projects failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch research projects.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

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

    const existingProjects = await db.orm.public.ResearchProject
      .select("id", "slug")
      .all();

    if (existingProjects.some((project) => project.slug === slug)) {
      return NextResponse.json(
        { error: "A research project with this slug already exists." },
        { status: 409 }
      );
    }

    const project = await db.orm.public.ResearchProject
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
      .create({
        gameId,
        title,
        slug,
        researchQuestion: researchQuestion || null,
        objective: objective || null,
        status: status || "DRAFT",
      });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/research/projects failed:", error);

    return NextResponse.json(
      {
        error: "Failed to create research project.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
