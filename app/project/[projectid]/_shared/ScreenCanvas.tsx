"use client";

import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/app/data/Prompt";

interface ScreenConfig {
  id: string;
  screenName: string;
  purpose: string;
  screenDescription: string;
}

interface ScreenCanvasProps {
  deviceType: string;
  userPrompt: string;
  existingScreens?: ScreenConfig[];
}

const ai = new GoogleGenAI({}); // Gemini 3 client

export default function ScreenCanvas({
  deviceType,
  userPrompt,
  existingScreens,
}: ScreenCanvasProps) {
  const [screens, setScreens] = useState<ScreenConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateScreens = async () => {
    setLoading(true);
    setError("");

    try {
      const prompt =
        APP_LAYOUT_CONFIG_PROMPT.replace("{deviceType}", deviceType) +
        (existingScreens
          ? `\nEXISTING SCREENS:\n${JSON.stringify(existingScreens)}`
          : "") +
        `\nUSER PROMPT:\n${userPrompt}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      // ✅ Type-safe access
      const candidate: unknown = response?.candidates?.[0]?.content;

      if (!candidate || typeof candidate !== "string") {
        setError("AI returned empty or invalid response");
        setLoading(false);
        return;
      }

      const raw: string = candidate.trim();

      // Extract JSON block safely
      const match = raw.match(/\{[\s\S]*\}$/);
      if (!match) {
        setError("Failed to extract JSON from AI output");
        setLoading(false);
        return;
      }

      const parsedJson = JSON.parse(match[0]);

      const mappedScreens: ScreenConfig[] =
        parsedJson.screens?.map((screen: any) => ({
          id: screen.id,
          screenName: screen.name,
          purpose: screen.purpose,
          screenDescription: screen.layoutDescription,
        })) || [];

      setScreens(mappedScreens);
    } catch (err: any) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-4">
        <button
          onClick={generateScreens}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Generate Screens
        </button>
      </div>

      {loading && (
        <div className="p-4 text-muted-foreground">Generating screens...</div>
      )}
      {error && <div className="p-4 text-red-500">{error}</div>}

      {screens.length === 0 && !loading && !error && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          No screens yet. Generate one using AI.
        </div>
      )}

      {screens.length > 0 && (
        <div className="flex-1 overflow-auto p-6 bg-muted/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {screens.map((screen) => (
              <div
                key={screen.id}
                className="rounded-2xl border bg-background shadow-sm"
              >
                {/* Header */}
                <div className="px-4 py-3 border-b flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{screen.screenName}</h3>
                    <p className="text-xs text-muted-foreground">
                      {screen.purpose}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{screen.id}</span>
                </div>

                {/* Layout Description */}
                <div className="p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {screen.screenDescription}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
