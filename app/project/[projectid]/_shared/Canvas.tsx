"use client";

import React from "react";
import {
  SandpackProvider,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { Loader2Icon, SmartphoneIcon } from "lucide-react";
import { ScreenConfig } from "@/type/types";

interface CanvasProps {
  loading: boolean;
  screenConfig: ScreenConfig[];
}

function wrapHtmlAsReactApp(html: string) {
  const safeHtml = html.replace(/`/g, "\\`");

  return `
import React from "react";

export default function App() {
  return (
    <div
      style={{ width: "100%", height: "100%" }}
      dangerouslySetInnerHTML={{
        __html: \`${safeHtml}\`
      }}
    />
  );
}
`;
}

export default function Canvas({ loading, screenConfig }: CanvasProps) {
  // Initial loading state
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
              <SmartphoneIcon className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">
                {screen.screenName || `Screen ${index + 1}`}
              </span>
            </div>

            {/* Mobile Frame */}
            <div
              className="bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] rounded-[3rem] border-[12px] border-slate-950 overflow-hidden relative"
              style={{ width: "320px", height: "640px" }}
            >
              {/* iPhone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-20" />

              {/* LIVE PREVIEW */}
              {screen.code ? (
                <SandpackProvider
                  template="react"
                  theme="light"
                  files={{
                    "/App.js": wrapHtmlAsReactApp(screen.code),
                    "/styles.css": `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --card: 0 0% 98%;
  --border: 220 13% 91%;
  --primary: 262 83% 58%;
  --muted-foreground: 215 16% 47%;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}
                    `,
                  }}
                  customSetup={{
                    dependencies: {
                      react: "latest",
                      "react-dom": "latest",
                      "lucide-react": "latest",
                      "clsx": "latest",
                      "tailwind-merge": "latest",
                      "framer-motion": "latest",
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
                <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-slate-50">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Loader2Icon className="w-6 h-6 text-slate-300 animate-spin" />
                  </div>
                  <p className="text-slate-400 text-sm italic">
                    Waiting for AI to generate code...
                  </p>
                </div>
              )}

              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-900/20 rounded-full z-20" />
            </div>
          </div>
        ))}

        {/* Empty State */}
        {screenConfig.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center mt-20 opacity-40">
            <SmartphoneIcon className="w-16 h-16 mb-4 text-slate-300" />
            <p className="text-slate-500 font-medium">
              No screens generated yet.
            </p>
            <p className="text-sm text-slate-400">
              Use the sidebar to describe your app.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
