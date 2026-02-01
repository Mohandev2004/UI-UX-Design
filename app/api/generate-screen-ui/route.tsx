import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { GENERATION_SCREEN_PROMPT } from "@/app/data/Prompt";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const {
      projectId,
      screenId,
      screenName,
      purpose,
      screenDescription,
      deviceType,
    } = await req.json();

    const userInput = `
Screen Name: ${screenName}
Screen Purpose: ${purpose}
Screen Description: ${screenDescription}
Device Type: ${deviceType}

Generate UI for THIS SCREEN ONLY.
Return HTML + Tailwind CSS ONLY.
Start with root <div>. End at last closing tag.
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
      config: {
        thinkingConfig: { includeThoughts: false },
      },
    });

    const html = response.text;

    if (!html) {
      return NextResponse.json(
        { error: "No output from Gemini" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      projectId,
      screenId,
      screenName,
      html,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
