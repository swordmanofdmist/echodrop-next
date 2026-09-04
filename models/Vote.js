import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isUpvote: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
);

VoteSchema.index({ post: 1, user: 1 }, { unique: true });

export default mongoose.models.Vote || mongoose.model("Vote", VoteSchema);
