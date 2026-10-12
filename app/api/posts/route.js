import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { postSummary } from "@/lib/serialize";
import { listPosts } from "@/lib/posts";
import { saveImage } from "@/lib/images";
import Post from "@/models/Post";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  await connectDb();
  const city = request.nextUrl.searchParams.get("city");
  const query = { expiresAt: { $gt: new Date() } };
  if (city) query.city = city;

  return NextResponse.json(await listPosts(query));
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const formData = await request.formData();
  const content = formData.get("content")?.trim();

  if (!content) {
    return NextResponse.json({ error: "Post content is required." }, { status: 400 });
  }

  if (content.length > 300) {
    return NextResponse.json({ error: "Post content cannot exceed 300 characters." }, { status: 400 });
  }

  const images = [];
  try {
    for (const file of formData.getAll("images")) {
      const fileName = await saveImage(file);
      if (fileName) images.push(fileName);
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }

  const post = await Post.create({
    content,
    images,
    user: user._id,
    city: user.city || "Unknown",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  await post.populate("user", "username");
  return NextResponse.json(postSummary(post, 0), { status: 201 });
}
