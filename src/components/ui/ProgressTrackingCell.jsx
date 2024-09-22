"use client";
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export const ProgressTrackingCell = ({ row }) => {
  const [progress, setProgress] = useState(row.progress);

  const handleProgressChange = (newValue) => {
    setProgress(newValue[0]);

    //add api call to update the progress
    toast.success(`Updated progress for ${row?.name} to ${newValue[0]}%`);
    console.log(`Updated progress for ${row?.id} to ${newValue[0]}%`);
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
