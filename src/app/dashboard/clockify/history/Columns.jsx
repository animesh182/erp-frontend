"use client";

import { convertDateToTime, formatDuration } from "@/lib/utils";
import { format } from "date-fns";
import { Dot } from "lucide-react";
import React from "react";

export const columns = () => [
{
        accessorKey: "latest_activity",
        header: "Time Entry",
        cell: ({ row }) => {
        const { latest_activity, projectName,project_color } = row.original; 
        return (
            <div className="w-96">
            <p>{latest_activity || "N/A"}</p>
            <div className="flex items-center">
                <Dot className=""style={{ color: project_color }} />
            <p className=" text-sm"
            style={{ color: project_color }}>{projectName || "N/A"}</p>
            </div>
            </div>
        );
        },
        enableSorting: false,
    },
{
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
    const { name, user_email } = row.original; 
    return (
        <div>
        <p className="">{name || "N/A"}</p>
        <p className="text-[#64748B] text-sm">{user_email|| "N/A"}</p>
        
        </div>
    );
    },
    enableSorting: false,
},
{
    accessorKey: "start_time",
    header: "Time",
    cell: ({ row }) => {
    const { start_time, end_time } = row.original; 

    return (
        <div className="space-y-1"> 
        <p className="">{convertDateToTime(start_time)|| "N/A"} - {convertDateToTime(end_time)|| "N/A"}</p>
        <p className="text-[#64748B] text-sm"> {format(start_time, "LLL dd, y")}</p>
        
        </div>
    );
    },
    enableSorting: true,
},  
{
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => {
        const { duration } = row.original; 
        return (
            <p>{formatDuration(duration)}</p>
        );
        },
        enableSorting: true,
    },




];


