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
import { ProjectSelect } from "@/components/ProjectSelect";

const handleKeyDown = (e) => {
  if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === "E") {
    e.preventDefault();
  }
};

const handleUppercaseChange = (e) => {
  e.target.value = e.target.value.toUpperCase();
};

// Ensure same order of formInputs as the columns.js
export const formInputs = [
  {
    component: <Input placeholder="Add" />,
    name: "name",
    required: true,
  },
  {
    component: <ProjectSelect />,
    name: "projectName",
    required: false,
  },
  {
    component: <Input placeholder="Add" onChange={handleUppercaseChange} />,
    name: "invoice",
    required: true,
  },
  {
    component: <DatePicker />,
    name: "invoiceIssuedDate",
    required: true,
  },
  {
    component: (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
    name: "status",
    required: true,
  },
  {
    component: <DatePicker />,
    name: "paidDate",
    required: false,
  },
  {
    component: (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Type</SelectLabel>
            <SelectItem value="salary">Salary</SelectItem>
            <SelectItem value="bonus">Bonus</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
    name: "type",
    required: true,
  },
  {
    component: (
      <Input
        placeholder="Add"
        type="number"
        min="0"
        onKeyDown={handleKeyDown}
      />
    ),
    name: "amount",
    required: true,
  },
  {
    component: <Button type="submit">Add</Button>,
    name: "actions",
    required: false,
  },
];
