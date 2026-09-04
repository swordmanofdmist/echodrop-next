import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { postSummary } from "@/lib/serialize";
import Comment from "@/models/Comment";
import Post from "@/models/Post";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  await connectDb();
  const posts = await Post.find({ user: user._id }).populate("user", "username").sort({ createdAt: -1 });
  const ids = posts.map((post) => post._id);
  const counts = await Comment.aggregate([
    { $match: { post: { $in: ids } } },
    { $group: { _id: "$post", count: { $sum: 1 } } }
  ]);
  const countMap = new Map(counts.map((item) => [item._id.toString(), item.count]));

  return NextResponse.json(posts.map((post) => postSummary(post, countMap.get(post._id.toString()) ?? 0)));
}
