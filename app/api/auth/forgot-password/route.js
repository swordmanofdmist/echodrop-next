import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  const body = await request.json();
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  await connectDb();
  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: { passwordHash: await bcrypt.hash(password, 10) },
      $inc: { sessionVersion: 1 }
    }
  );

  if (!user) {
    return NextResponse.json({ error: "No account was found with that email address." }, { status: 404 });
  }

  await clearAuthCookie();
  return NextResponse.json({ message: "Your password has been reset. You can now log in." });
}
