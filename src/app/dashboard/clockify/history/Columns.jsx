"use client";

import { convertDateToTime, formatDuration } from "@/lib/utils";
import { format } from "date-fns";
import { Dot } from "lucide-react";
import React, { useState } from "react";


    const LatestActivityCell = ({ latest_activity, project_name ,project_color }) => {
        const [isExpanded, setIsExpanded] = useState(false);
    
        const fullText = Array.isArray(latest_activity)
        ? latest_activity.join("")
        : typeof latest_activity === "string"
        ? latest_activity
        : "N/A";
    
        const truncatedText = fullText.length > 60
        ? `${fullText.slice(0, 50)}...`
        : fullText;
    
        const isTruncated = fullText.length > 60;
    
        return (
            <div className="w-96">
            <p onClick={() => isTruncated && setIsExpanded((prev) => !prev)}  className={` ${isTruncated ? "cursor-pointer" : ""}`}
                    title={
                        isTruncated
                            ? !isExpanded
                                ? "Click to see full description"
                                : "Click to collapse"
                            : ""
                        }>
                {isExpanded || !isTruncated ? fullText : truncatedText}
            </p>
            <div className="flex items-center mt-1">
                <Dot style={{ color: project_color }} />
                <p className="text-sm ml-2" style={{ color: project_color }}>
                    {project_name || "N/A"}
                </p>
            </div>
        </div>
        );
    };
export const columns = () => [
{
        accessorKey: "latest_activity",
        header: "Time Entry",
        cell: ({ row }) => {
        const { latest_activity, projectName,project_color } = row.original; 
        return (
            <LatestActivityCell
            latest_activity={latest_activity}
            project_name={projectName}
            project_color={project_color}
          />
        );
        },
        enableSorting: false,
        hideOnMobile:true
    },
{
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
    const { name, user_email,projectName,project_color } = row.original; 
    return (
        <div>
        <p className="">{name || "N/A"}</p>
        {/* <p className="text-muted-foreground  text-sm">{user_email|| "N/A"}</p> */}
        <p className="text-muted-foreground text-sm hidden md:block">{user_email || "N/A"}</p>
        <p className="text-sm md:hidden lg:hidden block" style={{ color:project_color|| "gray" }} >{projectName}</p>
        
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
        <p className="text-muted-foreground  text-sm"> {format(start_time, "LLL dd, y")}</p>
        
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
        hideOnMobile:true
    },




];


