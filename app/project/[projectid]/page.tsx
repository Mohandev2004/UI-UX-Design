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

  // Helper to handle Fetch and check for HTML-instead-of-JSON errors
  const safeFetch = async (url: string, options: any) => {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`❌ Route ${url} returned HTML. Check your folder structure!`);
      throw new Error("API Route Not Found (404)");
    }
    return res.json();
  };

  const generateScreenCode = async (screen: ScreenConfig) => {
    setLoading(true);
    try {
      const data = await safeFetch("/api/generate-screen-ui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          screenId: screen.screenId,
          screenName: screen.screenName,
          purpose: screen.purpose,
          screenDescription: screen.screenDescription,
          deviceType: projectDetails?.device || "website",
        }),
      });

      setScreenConfig((prev) =>
        prev.map((s) => (s.screenId === screen.screenId ? { ...s, code: data.html } : s))
      );
    } catch (err: any) {
      alert(err.message);
    } finally { setLoading(false); }
  };

  const generateLayoutWithAI = async (prompt: string) => {
    setLoading(true);
    try {
      const data = await safeFetch("/api/generate-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceType: projectDetails?.device || "website",
          userPrompt: prompt,
        }),
      });
      setScreenConfig(data.screens || []);
    } catch (err: any) {
      alert("Layout generation failed. Check console.");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!projectId) return;
    axios.get("/api/project", { params: { projectId } })
      .then(res => {
        setProjectDetails(res.data.projectDetail);
        setScreenConfig(res.data.screenConfig ?? []);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <ProjectHeader />
      <div className="flex flex-1 h-[calc(100vh-64px)]">
        {loading && <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60"><Loader2Icon className="animate-spin" /></div>}
        {projectDetails && (
          <>
            <SettingsSection project={projectDetails} screenConfig={screenConfig} onGenerateLayout={generateLayoutWithAI} />
            <Canvas loading={loading} screenConfig={screenConfig} onGenerateCode={generateScreenCode} />
          </>
        )}
      </div>
    </div>
  );
}