"use client";

import React from "react";
import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";
import { SmartphoneIcon, Loader2Icon } from "lucide-react";
import { ScreenConfig } from "@/type/types";

interface CanvasProps {
  loading: boolean;
  screenConfig: ScreenConfig[];
}

export default function Canvas({ loading, screenConfig }: CanvasProps) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Loader2Icon className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f8f9fa] relative overflow-auto p-10">
      <div className="min-w-max flex flex-col items-center gap-16">
        {screenConfig?.map((screen, index) => (
          <div key={screen.id || index} className="flex flex-col items-center gap-4">
            
            {/* Mobile Frame Container */}
            <div
              className="bg-white shadow-2xl rounded-[3rem] border-[12px] border-slate-950 overflow-hidden relative"
              style={{ width: "320px", height: "640px" }}
            >
              {/* LIVE PREVIEW ENGINE */}
              {screen.code ? (
                <SandpackProvider
                  template="react"
                  theme="light"
                  files={{
                    "/App.js": screen.code, // Injecting the code string from Gemini
                  }}
                  customSetup={{
                    dependencies: {
                      "lucide-react": "latest",
                      "tailwind-merge": "latest",
                      "clsx": "latest",
                    },
                  }}
                >
                  <SandpackPreview 
                    style={{ height: "640px" }} 
                    showNavigator={false} 
                    showRefreshButton={false} 
                  />
                </SandpackProvider>
              ) : (
                /* Fallback if code is missing */
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <p className="text-slate-400 text-sm">No code generated yet for this screen.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}