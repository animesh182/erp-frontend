// "use client";

import TimeCell from "./time-tracking";

import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import ClockifyBarChart from "./clockify-bar-chart";



const LatestActivityCell = ({ latest_activity, project_name }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const fullText = Array.isArray(latest_activity)
    ? latest_activity.join("")
    : typeof latest_activity === "string"
    ? latest_activity
    : "N/A";

  const truncatedText = fullText.length > 50
    ? `${fullText.slice(0, 50)}...`
    : fullText;

  const isTruncated = fullText.length > 50;

  return (
    <div>
      <p
        className={`w-72 ${isTruncated ? "cursor-pointer" : ""}`}
        onClick={() => isTruncated && setIsExpanded(!isExpanded)}
        title={
          isTruncated
            ? !isExpanded
              ? "Click to see full description"
              : "Click to collapse"
            : ""
        }
      >
        {isExpanded ? fullText : truncatedText}
      </p>
      <p className="text-sm">{project_name || "N/A"}</p>
    </div>
  );
};




export const columns = (barChartUser,startDate,endDate) => [
  {
    accessorKey: "user_name",
    header: "Team Member",
    cell: ({ row }) => {
      const { user_name, user_email } = row.original;
      return (
        <div>
          <p>{user_name || "N/A"}</p>
          <p className="text-muted-foreground text-sm">{user_email || "N/A"}</p>
        </div>
      );
    },
    enableSorting: true,
  },
{
  accessorKey: "latest_activity",
  header: "Latest Activity",
  cell: ({ row }) => {
    const { latest_activity, project_name } = row.original;
    return (
      <LatestActivityCell
        latest_activity={latest_activity}
        project_name={project_name}
      />
    );
  },
  enableSorting: false,
},


  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const { time, status } = row.original;
      return <TimeCell initialTime={time} status={status} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;
      return (
        <Badge
          className={`${
            status === "Ongoing"
              ? "bg-[#FEEDDA] text-[#FAA745]"
              : " p-1 bg-muted text-foreground"
          }`}
        >
          {status.toUpperCase()}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "time_tracked",
    header: `Total Time Tracked (${startDate}-${endDate})`,
    cell: ({ row }) => {
      const { user_name } = row.original;
      return (
        <div className="min-w-96">
          <ClockifyBarChart userName={user_name} selected={barChartUser} />
        </div>
      );
    },
    enableSorting: false,
  },
];
