"use client";
import React, { useState, useCallback, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { editProject } from "@/app/api/projects/editProject";

export const ProgressTrackingCell = ({ row, projectName, projectId }) => {
  const [progress, setProgress] = useState(row);
  const debouncedEditProjectRef = useRef(null);

  const debouncedEditProject = useCallback(
    (newProgress) => {
      if (debouncedEditProjectRef.current) {
        clearTimeout(debouncedEditProjectRef.current);
      }

      debouncedEditProjectRef.current = setTimeout(async () => {
        try {
          await editProject(projectId, { progress: newProgress });
          toast.success(
            `Updated progress for ${projectName} to ${newProgress}%`
          );
        } catch (error) {
          toast.error(`Failed to update progress: ${error.message}`);
          console.error(`Failed to update progress for ${projectName}:`, error);
        }
      }, 1000);
    },
    [projectId, projectName]
  );

  const handleProgressChange = (newValue) => {
    const newProgress = newValue[0];
    setProgress(newProgress);
    debouncedEditProject(newProgress);
  };

  return (
    <div className="flex items-center w-full max-w-xs">
      <Slider
        value={[progress]}
        onValueChange={handleProgressChange}
        max={100}
        step={10}
        className="mr-2"
      />
      <span className="min-w-[40px] text-right">{progress}%</span>
    </div>
  );
};
