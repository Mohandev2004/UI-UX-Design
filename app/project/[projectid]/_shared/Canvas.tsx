"use client";

import React from "react";
import { ScreenConfig } from "@/type/types";
import { SmartphoneIcon, InfoIcon, Loader2Icon, SparklesIcon } from "lucide-react";

interface CanvasProps {
  loading: boolean;
  screenConfig: ScreenConfig[];
}

export default function Canvas({ loading, screenConfig }: CanvasProps) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2Icon className="animate-spin text-primary w-8 h-8" />
          <p className="text-sm text-muted-foreground">Syncing Canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f8f9fa] relative overflow-auto scroll-smooth scrollbar-hide p-10">
      <div className="min-w-max flex flex-col items-center gap-16">
        {screenConfig?.length > 0 ? (
          screenConfig.map((screen, index) => (
            <div key={screen.id || index} className="flex flex-col items-center gap-4">
              {/* Header Label */}
              <div className="flex items-center justify-between w-full max-w-[320px] px-2 text-slate-500">
                <div className="flex items-center gap-2">
                  <SmartphoneIcon size={16} className="text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {screen.screenName}
                  </span>
                </div>
                <div className="px-2 py-0.5 rounded-md bg-slate-200 text-[10px] font-mono">
                  {screen.screenId}
                </div>
              </div>

              {/* Mobile Frame */}
              <div
                className="bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-[3rem] border-[12px] border-slate-950 overflow-hidden relative transition-all hover:scale-[1.02]"
                style={{ width: "320px", height: "640px" }}
              >
                {/* Notch / Speaker area */}
                <div className="absolute top-0 inset-x-0 h-7 bg-slate-950 flex justify-center items-start">
                  <div className="w-20 h-4 bg-slate-950 rounded-b-2xl" />
                </div>

                {/* Content Area */}
                <div className="p-8 pt-12 h-full flex flex-col bg-white">
                  <div className="mb-6">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-tighter px-2 py-1 bg-primary/10 rounded-lg">
                      {screen.purpose}
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-3 leading-tight">
                      {screen.screenName}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    "{screen.screenDescription}"
                  </p>

                  {/* AI Status / Code Badge */}
                  <div className="mt-auto mb-6">
                    {screen.code ? (
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-2xl border border-green-100">
                        <SparklesIcon size={14} className="text-green-600" />
                        <span className="text-[11px] font-medium text-green-700">Code Generated Successfully</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <InfoIcon size={14} className="text-slate-400" />
                        <span className="text-[11px] font-medium text-slate-400">Waiting for AI generation...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center mt-32 p-16 border-2 border-dashed border-slate-300 rounded-[2rem] bg-white shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <SmartphoneIcon className="text-slate-300" size={32} />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">Your Canvas is Ready</h3>
            <p className="text-sm text-slate-500 text-center max-w-[200px] mt-2">
              Add screens from the sidebar to start designing your application.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}