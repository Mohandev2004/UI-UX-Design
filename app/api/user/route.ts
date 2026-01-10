import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/schema"

/**
 * GET /api/user
 * Fetch all users
 */
export async function GET() {
  try {
    await connectDB()

    const users = await User.find().lean()

    return NextResponse.json(
      {
        success: true,
        total: users.length,
        users,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("GET /api/user error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user
 * Create a new user
 */
export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    const { name, email } = body

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and email are required",
        },
        { status: 400 }
      )
    }

    // Prevent duplicate email
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User already exists",
        },
        { status: 409 }
      )
    }

    const user = await User.create({ name, email })

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST /api/user error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create user",
      },
      { status: 500 }
    )
  }
}
