import { NextRequest, NextResponse } from "next/server";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/app/data/Prompt";

export async function POST(req: NextRequest) {
  try {
    const { deviceType, userPrompt, existingScreens } = await req.json();

    if (!deviceType || !userPrompt) {
      return NextResponse.json(
        { error: "deviceType and userPrompt are required" },
        { status: 400 }
      );
    }

    const prompt = `
${APP_LAYOUT_CONFIG_PROMPT}

DEVICE TYPE:
${deviceType}

USER PROMPT:
${userPrompt}

${existingScreens ? `EXISTING SCREENS:\n${JSON.stringify(existingScreens)}` : ""}
`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.HF_API_KEY && {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
          }),
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 800,
            temperature: 0.2,
            return_full_text: false,
          },
        }),
      }
    );

    const result = await response.json();
    const rawText = result?.[0]?.generated_text;

    if (!rawText) {
      return NextResponse.json(
        { error: "Empty AI response", result },
        { status: 500 }
      );
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON from AI", rawText },
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
