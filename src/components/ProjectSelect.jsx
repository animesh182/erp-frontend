"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";

export const ProjectSelect = ({ projectOptions, value, onChange }) => {
  if (!projectOptions) {
    return <Input placeholder="Add" value={value} disabled />;
  }

  // Sort projectOptions alphabetically by name
  const sortedProjectOptions = [...projectOptions].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="Select Project">
          {value || "Select Project"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Project</SelectLabel>
          {sortedProjectOptions.map((project) => (
            <SelectItem key={project.id} value={project.name}>
              {project.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
