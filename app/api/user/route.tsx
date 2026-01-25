import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { auth } from "@clerk/nextjs/server";

/* =======================
   GET USERS
======================= */
export async function GET() {
  try {
    const users = await db.select().from(usersTable);

    return NextResponse.json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =======================
   CREATE / UPSERT USER
======================= */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await req.json();
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email required" },
        { status: 400 }
      );
    }

    const [user] = await db
      .insert(usersTable)
      .values({
        name: name,
        email: email,
        clerkId: userId,
      })
      .onConflictDoUpdate({
        target: usersTable.email,
        set: {
          name: name,
          clerkId: userId,
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json(user);
  } catch (error: any) {
  console.error("POST /api/user ERROR:", error);

  return NextResponse.json(
    {
      error: error?.message,
      stack: error?.stack,
    },
    { status: 500 }
  );
}

}
