import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/schema";

export async function GET() {
  try {
    await connectDB();

    const user = await User.create({
      name: "Test User",
      email: `test${Date.now()}@mail.com`,
    });

    const users = await User.find();

    return NextResponse.json({
      createdUser: user,
      totalUsers: users.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
