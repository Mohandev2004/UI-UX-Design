"use client";

import { ScreenConfig } from "@/type/types";

interface ScreenCanvasProps {
  screens: ScreenConfig[];
}

export default function ScreenCanvas({ screens }: ScreenCanvasProps) {
  if (!screens.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        No screens yet. Generate one using AI.
      </div>
    );
  }

  return (
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
              <span className="text-xs text-muted-foreground">
                {screen.id}
              </span>
            </div>

            {/* Layout Description */}
            <div className="p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {screen.screenDescription}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
