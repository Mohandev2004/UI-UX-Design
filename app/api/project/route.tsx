import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/schema";
import { auth } from "@clerk/nextjs/server";

/* =======================
   CREATE PROJECT (POST)
======================= */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    console.log("POST body:", body);
    console.log("User ID:", userId);

    const { userInput, device, projectId } = body;

    if (!userInput || !device || !projectId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Create the project in DB
    const project = await Project.create({
      projectId,
      userInput,
      device,
      userId,
    });

    console.log("Project created:", project);

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* =======================
   GET PROJECT (GET)
======================= */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const projectId = req.nextUrl.searchParams.get("projectId");

    if (!projectId || projectId === "undefined") {
      return NextResponse.json({ error: "Invalid projectId" }, { status: 400 });
    }

    console.log("Fetching project:", { projectId, userId });

    const project = await Project.findOne({ projectId, userId });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
