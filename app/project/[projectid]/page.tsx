"use client";

import React, { useEffect, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";

import ProjectHeader from "./_shared/ProjectHeader";
import SettingsSection from "./_shared/SettingsSection";
import { ProjectType } from "@/type/types";

export default function ProjectCanvasPlayground() {
  const { projectId } = useParams(); // from /project/[projectId] route
  console.log("Project ID:", projectId);

  const [projectDetails, setProjectDetails] = useState<ProjectType | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const cancelToken: CancelTokenSource = axios.CancelToken.source();

    const fetchProject = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const { data } = await axios.get("/api/project", {
          params: { projectId }, // ✅ send as query param
          cancelToken: cancelToken.token,
        });

        if (!data) {
          setErrorMsg("Project not found");
          setProjectDetails(null);
          return;
        }

        setProjectDetails(data);
      } catch (err: any) {
        if (axios.isCancel(err)) return;
        setErrorMsg(
          err?.response?.data?.error || err.message || "Failed to load project"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();

    return () => cancelToken.cancel();
  }, [projectId]);

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
        <SettingsSection project={projectDetails} />
      )}
    </div>
  );
}
