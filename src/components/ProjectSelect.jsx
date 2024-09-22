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
  //   console.log(value, "value"); // This confirms that you're receiving the value correctly

  if (!projectOptions) {
    return <Input placeholder="Add" value={value} disabled />;
  }

  return (
    <Select onValueChange={onChange} disabled={!projectOptions}>
      <SelectTrigger>
        <SelectValue placeholder="Select Project">
          {value || "Select Project"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Project</SelectLabel>
          {projectOptions?.map((project) => (
            <SelectItem key={project.id} value={project.name}>
              {project.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
