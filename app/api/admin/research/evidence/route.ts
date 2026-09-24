import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET(request: Request) {
  try {
    const projectId = Number(
      new URL(request.url).searchParams.get("projectId")
    );

    const evidence = await db.orm.public.ResearchEvidence
      .select(
        "id",
        "researchProjectId",
        "claimId",
        "sourceId",
        "evidenceText",
        "sourceLocator",
        "relationship",
        "createdAt",
        "updatedAt"
      )
      .all();

    return NextResponse.json(
      projectId
        ? evidence.filter((item) => item.researchProjectId === projectId)
        : evidence
    );
  } catch (error) {
    console.error("GET research evidence failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch research evidence." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const researchProjectId = Number(body.researchProjectId);
    const claimId = Number(body.claimId);
    const sourceId = Number(body.sourceId);
    const evidenceText = String(body.evidenceText ?? "").trim();
    const sourceLocator = String(body.sourceLocator ?? "").trim();
    const relationship = String(body.relationship ?? "SUPPORTS").trim();

    if (!researchProjectId || !claimId || !sourceId || !evidenceText) {
      return NextResponse.json(
        { error: "Project, claim, source, and evidence text are required." },
        { status: 400 }
      );
    }

    const claims = await db.orm.public.ResearchClaim
      .select("id", "researchProjectId")
      .all();

    const claim = claims.find(
      (item) =>
        item.id === claimId &&
        item.researchProjectId === researchProjectId
    );

    if (!claim) {
      return NextResponse.json(
        { error: "Claim does not belong to this project." },
        { status: 400 }
      );
    }

    const sources = await db.orm.public.ResearchSource
      .select("id")
      .all();

    if (!sources.some((source) => source.id === sourceId)) {
      return NextResponse.json(
        { error: "Source does not exist." },
        { status: 400 }
      );
    }

    const evidence = await db.orm.public.ResearchEvidence
      .select(
        "id",
        "researchProjectId",
        "claimId",
        "sourceId",
        "evidenceText",
        "sourceLocator",
        "relationship",
        "createdAt",
        "updatedAt"
      )
      .create({
        researchProjectId,
        claimId,
        sourceId,
        evidenceText,
        sourceLocator: sourceLocator || null,
        relationship,
      });

    return NextResponse.json(evidence, { status: 201 });
  } catch (error) {
    console.error("POST research evidence failed:", error);
    return NextResponse.json(
      { error: "Failed to create research evidence." },
      { status: 500 }
    );
  }
}
