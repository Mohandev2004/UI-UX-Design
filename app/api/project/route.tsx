import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { projectsTable, screenConfigTable } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

/* =======================
   GET PROJECT + SCREENS
   /api/project?projectId=xxx
======================= */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = req.nextUrl.searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is missing" }, { status: 400 });
    }

    // Fetch project
    const [project] = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.projectId, projectId),
          eq(projectsTable.userId, userId)
        )
      );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Fetch all screens for this project
    const screens = await db
      .select()
      .from(screenConfigTable)
      .where(eq(screenConfigTable.projectId, projectId));

    return NextResponse.json({
      projectDetails: project,
      screens,
    });
  } catch (error: any) {
    console.error("GET /api/project error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* =======================
   CREATE / UPDATE PROJECT
======================= */
export async function POST(req: NextRequest) {
  try {
    
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, userInput, device } = await req.json();

    if (!projectId || !userInput || !device) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert or update project
    const [project] = await db
      .insert(projectsTable)
      .values({
        projectId,
        userInput,
        device,
        userId,
      })
      .onConflictDoUpdate({
        target: projectsTable.projectId,
        set: {
          userInput,
          device,
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json(project, { status: 201 });
    
  } catch (error: any) {
    console.error("POST /api/project error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
