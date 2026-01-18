"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";

import ProjectHeader from "./_shared/ProjectHeader";
import SettingsSection from "./_shared/SettingsSection";
import { ProjectType } from "@/type/types";

export default function ProjectCanvasPlayground() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [projectDetails, setProjectDetails] = useState<ProjectType | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setErrorMsg("Project ID is missing");
      setLoading(false);
      return;
    }
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data } = await axios.get("/api/project", {
        params: { projectId },
      });
      setProjectDetails(data);
    } catch (err: any) {
      console.error("Failed to load project", err);
      setErrorMsg(err?.response?.data?.error || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

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

      {/* Error message */}
      {!loading && errorMsg && (
        <p className="text-center text-red-500 mt-10">{errorMsg}</p>
      )}

      {/* Project content */}
      {!loading && projectDetails && <SettingsSection />}
    </div>
  );
}
