"use client";

import MultiLineNameCell from "@/components/MultiLineNameCell";
import { format } from "date-fns";




export const columns = [
  {
    accessorKey: "employeeName",
    header: "Assigned To",
    cell: ({ row }) => {
      const { user_name, user_email } = row.original; 
      return <MultiLineNameCell title={user_name} subtitle={user_email} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "project_role",
    header: "Role",
    enableSorting: false,
  },
  {
    accessorKey: "utilization",
    header: "Time Allocated",
    cell: ({ row }) => {
      const { utilization } = row.original;
      return <div>{utilization} hrs</div>;
    },
    enableSorting: false,
    cell: ({ row }) => {
      const { utilization } = row.original;
      const daysInMonth=24
      const monthlyUtlization=(utilization*24).toFixed(2)
      return (
        <div>
          {monthlyUtlization} <span className="text-xs font-medium">hrs/month</span>
        </div>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    enableSorting: false,
    cell: ({ row }) => {
      const { start_date } = row.original;
      return (
        <div>
          {start_date ? format(new Date(start_date), "MMM dd yyyy") : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    enableSorting: false,
    cell: ({ row }) => {
      const { end_date } = row.original;
      return (
        <div>
          {end_date ? format(new Date(end_date), "MMM dd yyyy") : "Present"}
        </div>
      );
    },
  },
];
