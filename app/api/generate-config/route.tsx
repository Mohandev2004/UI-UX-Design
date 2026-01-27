import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/app/data/Prompt";

const ai = new GoogleGenAI({});

export async function POST(req: NextRequest) {
  try {
    const { deviceType, userPrompt, existingScreens } = await req.json();

    if (!deviceType || !userPrompt) {
      return NextResponse.json(
        { error: "deviceType and userPrompt are required" },
        { status: 400 }
      );
    }

    const prompt =
      APP_LAYOUT_CONFIG_PROMPT.replace("{deviceType}", deviceType) +
      (existingScreens ? `\nEXISTING SCREENS:\n${JSON.stringify(existingScreens)}` : "") +
      `\nUSER PROMPT:\n${userPrompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    // ✅ Type-safe candidate
    const candidate: unknown = response?.candidates?.[0]?.content;

    if (!candidate || typeof candidate !== "string") {
      return NextResponse.json(
        { error: "AI returned empty or invalid response", response },
        { status: 500 }
      );
    }

    // ✅ Now safe to trim
    const cleaned: string = candidate.trim();

    // Extract JSON block
    let parsedJson;
    try {
      const match = cleaned.match(/\{[\s\S]*\}$/);
      if (!match) throw new Error("No JSON block found");
      parsedJson = JSON.parse(match[0]);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse JSON from AI", rawText: cleaned },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedJson);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
