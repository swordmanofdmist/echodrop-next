import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { createToken, setAuthCookie } from "@/lib/auth";
import User from "@/models/User";

export async function POST(request) {
  await connectDb();
  const body = await request.json();
  const username = body.username?.trim();
  const password = body.password ?? "";

  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  await setAuthCookie(createToken(user));
  return NextResponse.json({
    user: {
      id: user._id.toString(),
      username: user.username,
      city: user.city
    }
  });
}
