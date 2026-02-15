"use client";

import React, { useEffect } from "react";
import { Loader2Icon, MonitorIcon } from "lucide-react"; // Changed icon to monitor
import { ScreenConfig } from "@/type/types";

interface CanvasProps {
  loading: boolean;
  screenConfig: ScreenConfig[];
  onGenerateCode: (screen: ScreenConfig, deviceType?: string) => Promise<void>;
}

export default function Canvas({ loading, screenConfig, onGenerateCode }: CanvasProps) {
  // Automatically generate all screens on mount for website
  useEffect(() => {
    if (screenConfig && screenConfig.length > 0) {
      screenConfig.forEach(screen => {
        if (!screen.code) onGenerateCode(screen, "website"); // Force deviceType as website
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenConfig]);

  if (loading && screenConfig.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2Icon className="animate-spin text-blue-600 w-10 h-10" />
        <p className="text-sm text-slate-500 animate-pulse">
          Initializing Canvas...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f8f9fa] relative overflow-auto p-10 custom-scrollbar">
      <div className="min-w-max flex flex-row items-start justify-center gap-20">
        {screenConfig.map((screen, index) => (
          <div
            key={screen.id || index}
            className="flex flex-col items-center gap-6"
          >
            {/* Screen Label */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
              <MonitorIcon className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">
                {screen.screenName || `Screen ${index + 1}`}
              </span>
            </div>

            {/* Website Frame */}
            <div
              className="bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] rounded-xl border border-slate-950 overflow-hidden relative"
              style={{ width: "1024px", height: "600px" }} // Website frame size
            >
              {/* LIVE PREVIEW */}
              {screen.code ? (
                <iframe
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin"
                  srcDoc={`<!DOCTYPE html>
                    <html>
                      <head>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <style>
                          body { margin:0; padding:0; font-family:ui-sans-serif, system-ui; }
                        </style>
                      </head>
                      <body>${screen.code}</body>
                    </html>`}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-slate-50 gap-4">
                  <Loader2Icon className="animate-spin w-6 h-6 text-blue-500" />
                  <p className="text-slate-400 text-xs mt-1 px-4">Generating UI for website...</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {screenConfig.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center mt-20 opacity-40">
            <MonitorIcon className="w-16 h-16 mb-4 text-slate-300" />
            <p className="text-slate-500 font-medium">No screens found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
