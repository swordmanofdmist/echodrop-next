import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { commentDto } from "@/lib/serialize";
import Comment from "@/models/Comment";
import Post from "@/models/Post";

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const body = await request.json();
  const postId = body.postId;
  const content = body.content?.trim();

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  if (!content) {
    return NextResponse.json({ error: "Comment is required." }, { status: 400 });
  }

  if (content.length > 300) {
    return NextResponse.json({ error: "Comment cannot exceed 300 characters." }, { status: 400 });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  if (post.expiresAt <= new Date()) {
    return NextResponse.json({ error: "Comments are disabled on expired posts." }, { status: 400 });
  }

  const comment = await Comment.create({
    content,
    post: post._id,
    user: user._id
  });

  return NextResponse.json(commentDto(comment), { status: 201 });
}
