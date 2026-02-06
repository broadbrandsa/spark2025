import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_CODE = "0424";
const COOKIE_NAME = "spark-report-access";

function setAccessCookie(response: NextResponse, value: string) {
  response.cookies.set({
    name: COOKIE_NAME,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

function clearAccessCookie(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  return NextResponse.json({ unlocked: cookie === "1" });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  if (code !== ACCESS_CODE) {
    return NextResponse.json({ unlocked: false }, { status: 401 });
  }

  const response = NextResponse.json({ unlocked: true });
  setAccessCookie(response, "1");
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ unlocked: false });
  clearAccessCookie(response);
  return response;
}
