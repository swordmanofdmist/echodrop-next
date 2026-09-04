import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { commentDto, postSummary } from "@/lib/serialize";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import Vote from "@/models/Vote";

export async function GET(_request, { params }) {
  await connectDb();
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const post = await Post.findById(id).populate("user", "username");
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const user = await getCurrentUser();
  const comments = await Comment.find({ post: post._id }).sort({ createdAt: -1 });
  return NextResponse.json({
    ...postSummary(post, comments.length),
    canDelete: user?._id.toString() === post.user._id.toString(),
    comments: comments.map(commentDto)
  });
}

export async function DELETE(_request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  await connectDb();
  const { id } = await params;
  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  if (post.user.toString() !== user._id.toString()) {
    return NextResponse.json({ error: "You can only delete your own posts." }, { status: 403 });
  }

  await Promise.all([
    Comment.deleteMany({ post: post._id }),
    Vote.deleteMany({ post: post._id }),
    Post.deleteOne({ _id: post._id })
  ]);

  return NextResponse.json({ ok: true });
}
