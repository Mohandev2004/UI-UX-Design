import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("myapp");
    const users = db.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Create new user
    const newUser = {
      clerkUserId: userId,
      name: user.fullName ?? "",
      email,
      createdAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    return NextResponse.json({
      _id: result.insertedId,
      ...newUser,
    });
  } catch (error) {
    console.error("CREATE_USER_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
