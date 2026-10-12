import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { commentDto } from "@/lib/serialize";
import Comment from "@/models/Comment";
import Post from "@/models/Post";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  await connectDb();
  const { postId } = await params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const comments = await Comment.find({ post: post._id }).sort({ createdAt: -1 });
  return NextResponse.json(comments.map(commentDto));
}
