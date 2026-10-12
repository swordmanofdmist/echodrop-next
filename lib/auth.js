import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

const cookieName = "echodrop_token";

export function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      username: user.username,
      city: user.city,
      sessionVersion: user.sessionVersion ?? 0
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function setAuthCookie(token) {
  const jar = await cookies();
  jar.set(cookieName, token, {
    httpOnly: true,
    //sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAuthCookie() {
  const jar = await cookies();
  jar.delete(cookieName);
}

export async function getCurrentUser() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (!token) return null;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    await connectDb();
    const user = await User.findById(payload.userId).select("_id username email city createdAt sessionVersion");
    if (!user || (user.sessionVersion ?? 0) !== (payload.sessionVersion ?? 0)) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}
