import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/app/data/Prompt";

// Initialize the AI client outside the handler
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // 1. Get the screen details from the request
    const { 
        projectId, 
        screenName, 
        purpose, 
        screenDescription, 
        deviceType // e.g., 'mobile' or 'desktop'
    } = await req.json();

    // 2. Build the specific user prompt
    const userPrompt = `
      Design a screen named "${screenName}".
      Purpose: ${purpose}.
      Description: ${screenDescription}.
    `;

    // 3. Combine with your System Prompt
    const finalPrompt =
      APP_LAYOUT_CONFIG_PROMPT.replace("{deviceType}", deviceType || "mobile") +
      `\n\nUSER PROMPT:\n${userPrompt}`;

    // 4. Generate the code using Gemini 3 Flash
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: finalPrompt,
      config: {
        thinkingConfig: { includeThoughts: false } 
      }
    });

    const rawText = response.text;

    if (!rawText) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    // 5. Extract the JSON (which includes the 'code' field for Sandpack)
    let parsedJson;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      parsedJson = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      return NextResponse.json({ error: "Invalid JSON format", rawText }, { status: 500 });
    }

    // 6. Return the JSON to the frontend
    // This should contain { "code": "...", "screenName": "..." }
    return NextResponse.json(parsedJson);

  } catch (err: any) {
    if (err.status === 429) {
      return NextResponse.json({ error: "Rate limit reached" }, { status: 429 });
    }
    return NextResponse.json({ error: err.message || "Server Error" }, { status: 500 });
  }
}