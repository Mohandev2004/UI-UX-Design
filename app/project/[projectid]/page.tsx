"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import ScreenCanvas from "./_shared/ScreenCanvas";


import ProjectHeader from "./_shared/ProjectHeader";
import SettingsSection from "./_shared/SettingsSection";
import { ProjectType, ScreenConfig } from "@/type/types";

export default function ProjectCanvasPlayground() {
  const { projectId } = useParams<{ projectId: string }>();

  const [projectDetails, setProjectDetails] =
    useState<ProjectType | null>(null);
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
        deviceType: "Website",
        userPrompt: prompt,
        existingScreens: screenConfig,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "AI failed");
    }

    setProjectDetails((prev) =>
      prev
        ? {
            ...prev,
            projectName: data.projectName,
            theme: data.theme,
          }
        : prev
    );

    setScreenConfig(data.screens);
  } catch (err) {
    console.error("AI generation error:", err);
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

        console.log("API response:", data);

        if (!data?.projectDetail) {
          setErrorMsg("Project not found");
          setProjectDetails(null);
          return;
        }

        setProjectDetails(data.projectDetail);
        setScreenConfig(data.screenConfig ?? []);

       {!loading && projectDetails && (
  <SettingsSection
    project={projectDetails}
    screenConfig={screenConfig}
    onGenerateLayout={generateLayoutWithAI} // ✅ REQUIRED
  />
)}

      } catch (err: any) {
        if (err.name === "CanceledError") return;

        setErrorMsg(
          err?.response?.data?.error ||
            err.message ||
            "Failed to load project"
        );
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
    <div className="relative min-h-screen">
      <ProjectHeader />

      {/* Loader */}
      {loading && (
        <div className="absolute left-1/2 top-24 -translate-x-1/2 bg-blue-300/20 border border-blue-400 rounded-xl px-4 py-2">
          <div className="flex items-center gap-2">
            <Loader2Icon className="animate-spin" />
            <span>Loading project...</span>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && errorMsg && (
        <p className="text-center text-red-500 mt-10">{errorMsg}</p>
      )}

      {/* Content */}
      {!loading && projectDetails && (
        <SettingsSection
  project={projectDetails}
  screenConfig={screenConfig}
  onGenerateLayout={generateLayoutWithAI}
/>
      )}
      {!loading && projectDetails && (
  <div className="flex h-[calc(100vh-64px)]">
    {/* Left Settings */}
    <SettingsSection
      project={projectDetails}
      screenConfig={screenConfig}
      onGenerateLayout={generateLayoutWithAI}
    />

    {/* Right Canvas */}
    <ScreenCanvas screens={screenConfig} />
  </div>
)}

    </div>
  );
}
