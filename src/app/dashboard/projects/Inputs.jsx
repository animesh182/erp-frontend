"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const handleKeyDown = (e) => {
  if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === "E") {
    e.preventDefault();
  }
};

export const formInputs = [
  {
    component: <Input placeholder="Project Name" />,
    name: "name",
    required: true,
  },
  {
    component: (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Project Health" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Project Health</SelectLabel>
            <SelectItem value="on-track">On Track</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
    name: "health",
    required: true,
  },
  {
    component: <Input placeholder="Project Category" />,
    name: "projectCategory",
    required: true,
  },
  {
    component: <Input placeholder="Platform" />,
    name: "platform",
    required: true,
  },
  {
    component: <Input placeholder="Client Name" />,
    name: "clientName",
    required: true,
  },
  {
    component: (
      <Input placeholder="Client Email" type="email" disabled={false} />
    ),

    name: "clientEmail",
    required: true,
  },

  {
    component: (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
    name: "status",
    required: true,
    filterValues: ["All", "not-started", "ongoing", "done"],
  },
  {
    component: (
      <Input
        placeholder="Team Members Count"
        type="number"
        min="0"
        onKeyDown={handleKeyDown}
      />
    ),
    name: "teamMembersCount",
    required: true,
  },
  {
    component: (
      <Input
        placeholder="Progress (%)"
        type="number"
        min="0"
        max="100"
        onKeyDown={handleKeyDown}
      />
    ),
    name: "progress",
    required: true,
  },
  {
    component: <DatePicker />,
    name: "startDate",
    required: true,
  },
  {
    component: <DatePicker />,
    name: "endDate",
    required: true,
  },
  {
    component: (
      <Input
        placeholder="Budget"
        type="number"
        min="0"
        onKeyDown={handleKeyDown}
      />
    ),
    name: "budget",
    required: true,
  },
  {
    component: <Button type="submit">Add Project</Button>,
    name: "actions",
    required: false,
  },
];
