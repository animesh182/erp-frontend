"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import ProjectHealth from "@/components/ProjectHealth";


export const ProgressBar = ({value}) => {
  return (
    <div className="flex items-center w-full gap-2">
      <Progress value={value} className="h-2 w-2/3"/><span className="font-semibold">{value}%</span>
    </div>
  )
}

export const columns = [
  {
    accessorKey: "name",
    header: "Project Name",
    enableSorting: true,
    cell: ({ row }) => {
      const { name, project_health } = row.original;
      console.log(row, "TestTest")
      return (<div>
      <p className="font-medium">{name}</p>
      <ProjectHealth health={project_health} />
    </div>
      );
    },
  },
  {
    accessorKey: "timeAllocated",
    header: "Time Allocated",
    enableSorting: false,
    cell: ({ row }) => {
      const { timeAllocated } = row.original;
      return timeAllocated ? <span className="font-medium">{timeAllocated} hours/day</span> : "No Data"; // Show "No Data" if the invoice_no is null or undefined
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;
      return (
        <Badge
          className={`${
            status?.toLowerCase() === "completed"
              ? "bg-green-100 text-green-800"
              : "bg-orange-300 text-orange-600"
          }`}
        >
          {status ? status : "No Data"} {/* Show "No Data" */}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "utilization",
    header: "Utilization Percentage",
    cell: ({ row }) => {
      const { utilization } = row.original;
    
      return (
      
        <>
          {utilization ? 
                      (<ProgressBar value={utilization}/>)

           : "N/A"}
        </>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const { startDate } = row.original;
      return (
        <span className="font-medium">
          {startDate
            ? format(new Date(startDate), "MMM dd yyyy")
            : "N/A"}
        </span>
      );
    },
    enableSorting: false,  
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const { endDate } = row.original;
      return (
        <span className="font-medium">
          {endDate==="N/A" || !endDate
            ? "N/A":format(new Date(endDate), "MMM dd yyyy")
            }
      
           
        </span>
      );
    },
    enableSorting: false,
  },
];