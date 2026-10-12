import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  return NextResponse.json(await listPosts({ user: user._id }));
}
