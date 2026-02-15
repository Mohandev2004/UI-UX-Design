import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { GENERATION_SCREEN_PROMPT } from "@/app/data/Prompt";
import { db } from "@/config/db";
import { screenConfigTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { projectId, screenId, screenName, purpose, screenDescription, deviceType } = await req.json();

    console.log("🔵 API TRIGGERED: generate-screen-ui for", screenName);

    const userInput = `
      Screen Name: ${screenName}
      Purpose: ${purpose}
      Description: ${screenDescription}
      Device: ${deviceType}
      Generate clean production-ready HTML + Tailwind CSS only.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: GENERATION_SCREEN_PROMPT },
            { text: userInput },
          ],
        },
      ],
    });

    const html = response.text?.replace(/```html|```/g, "").trim() || "";

    console.log("✨ AI Generated HTML. Length:", html.length);

    // ✅ Update database
    await db.update(screenConfigTable)
      .set({ code: html })
      .where(
        and(
          eq(screenConfigTable.projectId, projectId),
          eq(screenConfigTable.screenId, screenId)
        )
      );

    console.log("✅ DB Updated successfully");

    return NextResponse.json({ html });

  } catch (err: any) {
    console.error("❌ API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
