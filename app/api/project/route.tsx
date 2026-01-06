import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/schema";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
  const { isAuthenticated, userId } = await auth();

    if (!isAuthenticated || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { userInput, device, projectId } = await req.json();

    if (!userInput || !device || !projectId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const project = await Project.create({
      projectId,
      userInput,
      device,
      userId,
    });

    return NextResponse.json({ projectId: project.projectId }, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
