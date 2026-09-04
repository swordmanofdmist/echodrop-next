import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { createToken, setAuthCookie } from "@/lib/auth";
import User from "@/models/User";

export async function POST(request) {
  await connectDb();
  const body = await request.json();
  const username = body.username?.trim();
  const email = body.email?.trim().toLowerCase();
  const city = body.city?.trim();
  const password = body.password ?? "";

  if (!username || username.length < 3) {
    return NextResponse.json({ error: "Username must be at least 3 characters." }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  if (!city) {
    return NextResponse.json({ error: "City is required." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) {
    return NextResponse.json({ error: "Username or email is already registered." }, { status: 400 });
  }

  const user = await User.create({
    username,
    email,
    city,
    passwordHash: await bcrypt.hash(password, 10)
  });

  await setAuthCookie(createToken(user));
  return NextResponse.json({ user: { id: user._id.toString(), username, city } }, { status: 201 });
}
