import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/app/data/Prompt";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Check API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ API CRASHED: GEMINI_API_KEY is missing in .env.local");
      return NextResponse.json(
        { error: "Server configuration error (API Key)" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const body = await req.json();
    const { deviceType, userPrompt } = body;

    // 2️⃣ Validate input
    if (!deviceType || !userPrompt) {
      return NextResponse.json(
        { error: "Missing deviceType or userPrompt" },
        { status: 400 }
      );
    }

    console.log("🔵 Request received for:", deviceType);

    const prompt =
      (APP_LAYOUT_CONFIG_PROMPT || "Generate layout for {deviceType}")
        .replace("{deviceType}", deviceType) +
      `\nUSER PROMPT: ${userPrompt}`;

    // 🔥 Gemini 3 Flash Preview
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response.text || "";

    console.log("🤖 AI Response Text:", text);

    // 🛠️ STRONGER CLEANING LOGIC
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("❌ AI failed to return JSON. Raw text:", text);
      return NextResponse.json(
        { error: "AI returned non-JSON text" },
        { status: 500 }
      );
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsedData);

  } catch (err: any) {
    console.error("❌ API CRASHED:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
