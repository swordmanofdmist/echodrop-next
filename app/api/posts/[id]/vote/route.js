import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import Post from "@/models/Post";
import Vote from "@/models/Vote";

export async function POST(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const body = await request.json();
  const isUpvote = body.isUpvote !== false;
  const existingVote = await Vote.findOne({ post: post._id, user: user._id });

  if (existingVote) {
    if (existingVote.isUpvote === isUpvote) {
      await existingVote.deleteOne();
      if (isUpvote) post.upvoteCount -= 1;
      else post.downvoteCount -= 1;
    } else {
      existingVote.isUpvote = isUpvote;
      await existingVote.save();
      if (isUpvote) {
        post.upvoteCount += 1;
        post.downvoteCount -= 1;
      } else {
        post.upvoteCount -= 1;
        post.downvoteCount += 1;
      }
    }
  } else {
    await Vote.create({ post: post._id, user: user._id, isUpvote });
    if (isUpvote) post.upvoteCount += 1;
    else post.downvoteCount += 1;
  }

  post.upvoteCount = Math.max(0, post.upvoteCount);
  post.downvoteCount = Math.max(0, post.downvoteCount);
  await post.save();

  return NextResponse.json({
    upvotes: post.upvoteCount,
    downvotes: post.downvoteCount
  });
}
