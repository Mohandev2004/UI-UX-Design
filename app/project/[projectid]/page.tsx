"use client"
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import React, { useEffect } from 'react'
import ProjectHeader from './_shared/ProjectHeader'
import SettingsSection from './_shared/SettingsSection'
import axios from 'axios'
import { useParams } from 'next/navigation'

function ProjectCanvasPlayground() {

  const { projectId } = useParams<{ projectId: string }>();
  
useEffect(() => {
  if (projectId) {
    getProjectDetails();
  }
}, [projectId]);

const getProjectDetails = async () => {
  try {
    const result = await axios.get("/api/project", {
      params: { projectId },
    });

    console.log(result.data);
  } catch (error) {
    console.error("Failed to fetch project", error);
  }
};


  return (
    <div>
        <ProjectHeader />
        <div>
          {/* Settings */}
          <SettingsSection />

          {/* Canvas */}
        </div>
    </div>
  )
}

export default ProjectCanvasPlayground
