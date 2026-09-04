import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    city: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
    upvoteCount: {
      type: Number,
      default: 0
    },
    downvoteCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
