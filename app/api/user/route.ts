import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/schema";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/user
 * Fetch all users (optional – keep if you need it)
 */
export async function GET() {
  try {
    await connectDB();

    const users = await User.find().lean();

    return NextResponse.json(
      {
        success: true,
        total: users.length,
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/user error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user
 * Create user if not exists (IDEMPOTENT)
 * Safe to call on every app load
 */
export async function POST(req: Request) {
  try {
    // Optional but recommended: protect route with Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid or empty JSON body" },
        { status: 400 }
      );
    }

    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and email are required",
        },
        { status: 400 }
      );
    }

    // 🔥 Idempotent user creation
    const user = await User.findOneAndUpdate(
      { email },                 // unique identifier
      { name, email, clerkId: userId },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/user error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create or fetch user",
      },
      { status: 500 }
    );
  }
}
