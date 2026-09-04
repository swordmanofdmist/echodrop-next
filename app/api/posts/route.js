import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { postSummary } from "@/lib/serialize";
import Comment from "@/models/Comment";
import Post from "@/models/Post";

export async function GET(request) {
  await connectDb();
  const city = request.nextUrl.searchParams.get("city");
  const query = { expiresAt: { $gt: new Date() } };
  if (city) query.city = city;

  const posts = await Post.find(query).populate("user", "username").sort({ createdAt: -1 });
  const ids = posts.map((post) => post._id);
  const counts = await Comment.aggregate([
    { $match: { post: { $in: ids } } },
    { $group: { _id: "$post", count: { $sum: 1 } } }
  ]);
  const countMap = new Map(counts.map((item) => [item._id.toString(), item.count]));

  return NextResponse.json(posts.map((post) => postSummary(post, countMap.get(post._id.toString()) ?? 0)));
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  await connectDb();
  const body = await request.json();
  const content = body.content?.trim();

  if (!content) {
    return NextResponse.json({ error: "Post content is required." }, { status: 400 });
  }

  if (content.length > 300) {
    return NextResponse.json({ error: "Post content cannot exceed 300 characters." }, { status: 400 });
  }

  const post = await Post.create({
    content,
    user: user._id,
    city: user.city || "Unknown",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  await post.populate("user", "username");
  return NextResponse.json(postSummary(post, 0), { status: 201 });
}
