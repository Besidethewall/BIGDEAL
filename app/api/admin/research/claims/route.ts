import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET(request: Request) {
  try {
    const projectId = Number(
      new URL(request.url).searchParams.get("projectId")
    );

    const claims = await db.orm.public.ResearchClaim
      .select(
        "id",
        "researchProjectId",
        "statement",
        "classification",
        "status",
        "importance",
        "createdAt",
        "updatedAt"
      )
      .all();

    return NextResponse.json(
      projectId
        ? claims.filter((claim) => claim.researchProjectId === projectId)
        : claims
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch research claims." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const researchProjectId = Number(body.researchProjectId);
    const statement = String(body.statement ?? "").trim();
    const classification = String(body.classification ?? "UNVERIFIED").trim();
    const status = String(body.status ?? "OPEN").trim();
    const importance = String(body.importance ?? "MEDIUM").trim();

    if (!researchProjectId || !statement) {
      return NextResponse.json(
        { error: "Project and statement are required." },
        { status: 400 }
      );
    }

    const projects = await db.orm.public.ResearchProject
      .select("id")
      .all();

    if (!projects.some((project) => project.id === researchProjectId)) {
      return NextResponse.json(
        { error: "Research project does not exist." },
        { status: 400 }
      );
    }

    const claim = await db.orm.public.ResearchClaim
      .select(
        "id",
        "researchProjectId",
        "statement",
        "classification",
        "status",
        "importance",
        "createdAt",
        "updatedAt"
      )
      .create({
        researchProjectId,
        statement,
        classification,
        status,
        importance,
      });

    return NextResponse.json(claim, { status: 201 });
  } catch (error) {
    console.error("POST research claim failed:", error);

    return NextResponse.json(
      { error: "Failed to create research claim." },
      { status: 500 }
    );
  }
}