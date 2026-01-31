"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";

import ProjectHeader from "./_shared/ProjectHeader";
import SettingsSection from "./_shared/SettingsSection";
import Canvas from "./_shared/Canvas";
import { ProjectType, ScreenConfig } from "@/type/types";

export default function ProjectCanvasPlayground() {
  const { projectId } = useParams<{ projectId: string }>();

  const [projectDetails, setProjectDetails] = useState<ProjectType | null>(null);
  const [screenConfig, setScreenConfig] = useState<ScreenConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // -----------------------------
  // Generate Screen Config
  // -----------------------------
  const generateLayoutWithAI = async (prompt: string) => {
    try {
      const res = await fetch("/api/layout-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceType: "Mobile",
          userPrompt: prompt,
          existingScreens: screenConfig,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI failed");

      setProjectDetails((prev) =>
        prev ? { ...prev, projectName: data.projectName || prev.projectName } : prev
      );

      setScreenConfig(data.screens || []);
    } catch (err) {
      console.error("AI generation error:", err);
      alert("Failed to generate layout.");
    }
  };

  // -----------------------------
  // Fetch Project
  // -----------------------------
  useEffect(() => {
    if (!projectId) return;
    const controller = new AbortController();

    const fetchProject = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const { data } = await axios.get("/api/project", {
          params: { projectId },
          signal: controller.signal,
        });

        if (!data?.projectDetail) {
          setErrorMsg("Project not found");
          return;
        }

        setProjectDetails(data.projectDetail);
        setScreenConfig(data.screenConfig ?? []);

      } catch (err: any) {
        if (err.name === "CanceledError") return;
        setErrorMsg(err?.response?.data?.error || err.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    return () => controller.abort();
  }, [projectId]);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <ProjectHeader />

      <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Loader Overlay */}
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl px-6 py-4 flex items-center gap-3">
              <Loader2Icon className="animate-spin text-primary" />
              <span className="font-medium text-slate-700">Syncing Workspace...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && errorMsg && (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
            <p className="text-red-500 font-semibold mb-4">{errorMsg}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Sidebar and Canvas */}
        {!loading && projectDetails && (
          <>
            <SettingsSection
              project={projectDetails}
              screenConfig={screenConfig}
              onGenerateLayout={generateLayoutWithAI}
            />

            <Canvas 
              loading={loading} 
              screenConfig={screenConfig} 
            />
          </>
        )}
      </div>
    </div>
  );
}