import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      unique: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
