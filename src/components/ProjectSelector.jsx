"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Adjust path as needed

function ProjectSelector({
  title,
  options,
  defaultValue,
  onValueChange,
  triggerClassName = "w-[150px] mt-2",
  placeholder = "Select",
}) {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");

  const handleSelectChange = (value) => {
    setSelectedValue(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <div className="flex flex-row gap-2 align-center justify-start p-4">
      <h2 className="text-xl font-semibold self-end">{title}</h2>
      <Select onValueChange={handleSelectChange} value={selectedValue}>
        <SelectTrigger className="h-8 px-2 text-xs rounded-sm border border-gray-300 w-fit">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="text-xs">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="py-1 px-2 text-xs"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default ProjectSelector;
