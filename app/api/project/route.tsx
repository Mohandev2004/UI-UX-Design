import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { projectsTable } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";


/* =======================
   GET PROJECT + SCREENS
   /api/project?projectId=xxx
======================= */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "Missing Project ID" }, { status: 400 });
  }

  try {
    // Query database for the project
    const result = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.projectId, projectId));

    if (result.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Wrap the result to match the frontend's expectations
    return NextResponse.json({
      projectDetail: result[0],
      screenConfig: [], // Add your screen configuration logic here later
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/* =======================
   CREATE / UPDATE PROJECT
======================= */
export async function POST(req: NextRequest) {
  try {
    const { userInput, device, projectId, config } = await req.json();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await db
      .insert(projectsTable)
      .values({
        projectId,
        userInput,
        device,
        userId: user.primaryEmailAddress?.emailAddress as string,
        config: config ?? null, // optional
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

