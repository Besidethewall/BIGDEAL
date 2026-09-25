import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const response = NextResponse.json({ ok: true });

      response.cookies.set("isAdmin", "true", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid admin credentials." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to login." },
      { status: 500 }
    );
  }
}