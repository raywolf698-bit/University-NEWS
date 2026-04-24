import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "@/utils/queries/users";

export async function POST(request) {
  try {
    const body = await request.json();
    const { full_name, email, password, role, faculty } = body;

    if (!full_name || !email || !password) {
      return NextResponse.json(
        { error: "full_name, email and password are required" },
        { status: 400 }
      );
    }

    // check if email already exists
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // hash password
    const password_hash = await bcrypt.hash(password, 12);

    await createUser({ full_name, email, password_hash, role, faculty });

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/auth/register]", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}