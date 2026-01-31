"use client";

import React, { useState, useEffect } from "react";
import { THEME_NAME_LIST, THEMES } from "@/app/data/Themes";
import type { ThemeKey } from "@/app/data/Themes";
import { ProjectType, ScreenConfig } from "@/type/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Camera, Share, Sparkles } from "lucide-react";

interface SettingsSectionProps {
  project: ProjectType;
  screenConfig?: ScreenConfig[];
  onGenerateLayout: (prompt: string) => Promise<void>; // ✅ NEW
}

export default function SettingsSection({
  project,
  screenConfig,
  onGenerateLayout,
}: SettingsSectionProps) {
  const [selectedTheme, setSelectedTheme] =
    useState<ThemeKey>("AURORA_INK");
  const [projectName, setProjectName] = useState("");
  const [userNewScreenInput, setUserNewScreenInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setProjectName(project.userInput || "");
    }
  }, [project]);

  const handleGenerate = async () => {
    if (!userNewScreenInput.trim()) return;

    setLoading(true);
    await onGenerateLayout(userNewScreenInput);
    setLoading(false);
    setUserNewScreenInput("");
  };

  

  return (
    <div className="w-[300px] h-[90vh] p-5 flex flex-col gap-5 border-r">
      <h2 className="font-medium text-lg">Settings</h2>

      {/* Project Name */}
      <div>
        <h2 className="text-sm mb-1">Project Name</h2>
        <Input
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      {/* Generate Screen */}
      <div>
        <h2 className="text-sm mb-1">Generate New Screen</h2>
        <Textarea
          placeholder="Enter prompt to generate screen using AI"
          value={userNewScreenInput}
          onChange={(e) => setUserNewScreenInput(e.target.value)}
          className="min-h-24"
        />
        <Button
          size="sm"
          className="mt-2 w-full gap-2 cursor-pointer"
          onClick={handleGenerate}
          disabled={loading}
        >
          <Sparkles size={16} />
          {loading ? "Generating..." : "Generate With AI"}
        </Button>
      </div>

      {/* Themes */}
      <div className="flex-1">
        <h2 className="text-sm mb-1">Themes</h2>
        <div className="h-[200px] overflow-auto pr-1 scroll-smooth scrollbar-hide">
          {THEME_NAME_LIST.map((theme) => (
            <div
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={`p-2 mb-2 rounded-xl border transition-all cursor-pointer
                ${
                  theme === selectedTheme
                    ? "border-primary bg-primary/20"
                    : "hover:bg-muted"
                }`}
            >
              <h3 className="text-sm font-medium">{theme}</h3>

              <div className="flex gap-2 mt-2">
                {[
                  THEMES[theme].primary,
                  THEMES[theme].secondary,
                  THEMES[theme].accent,
                  THEMES[theme].background,
                ].map((color, index) => (
                  <div
                    key={index}
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extras */}
      <div>
        <h2 className="text-sm mb-1">Extras</h2>
        <div className="flex gap-3">
          <Button size="sm" variant="outline" className="gap-2 cursor-pointer">
            <Camera size={16} />
            Screenshot
          </Button>
          <Button size="sm" variant="outline" className="gap-2 cursor-pointer" >
            <Share size={16} />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
