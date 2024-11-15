"use client";

import { Badge } from "@/components/ui/badge";
import { CircleDot } from "lucide-react";

export const columns = [
  {
        accessorKey: "user_name",
        header: "Team Member",
        cell: ({ row }) => {
          const { user_name, user_email } = row.original; // Access the full row data
          return (
            <div>
              <p>{user_name || "N/A"}</p>
              <p className="text-[#64748B] text-sm">{user_email || "N/A"}</p>
             
            </div>
          );
        },
        enableSorting: true,
      },
  {
    accessorKey: "latest_activity",
    header: "Latest Activity",
    cell: ({ row }) => {
      const { latest_activity, project_name } = row.original; // Access the full row data
      return (
        <div>
          <p className="w-80">{latest_activity || "N/A"}</p>
          <p className=" text-sm">{project_name|| "N/A"}</p>
         
        </div>
      );
    },
    enableSorting: false,
  },
  // {
  //   accessorKey: "time",
  //   header: "Time",
  //   enableSorting: true,
  // },

  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const { time, status } = row.original; // Access the full row data
      return (
        <div className="flex items-center gap-2">
          <p className=" text-sm">{time|| "N/A"}</p>
          {status === "Ongoing" && <CircleDot color="red"  height={14} width={14}/>}
          
         
        </div>
      );
    },
    enableSorting: false,
  },


  {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const { status } = row.original; // Access the full row data
          return (
            <Badge
              className={`${
                status === "Ongoing"
                ? "bg-[#FEEDDA] text-[#FAA745]"
                  : "bg-gray-100 text-gray-800"
                
                  
              }`}
            >
        
              {(status.toUpperCase())}
            </Badge>
          );
        },
        enableSorting: false,
      },
  {
    accessorKey: "time_tracked",
    header: "Total Time Tracked (This Week)",
    enableSorting: false,
  },
];

