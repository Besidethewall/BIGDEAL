import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: 1,
      name: "World of Warcraft",
      slug: "world-of-warcraft",
    },
    {
      id: 2,
      name: "AION 2",
      slug: "aion-2",
    },
    {
      id: 3,
      name: "Diablo",
      slug: "diablo",
    },
  ]);
}