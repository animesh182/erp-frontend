import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dot } from "lucide-react";
import { format } from "date-fns";

export function ProjectCard({
  title = "Jambo Travel House",
  projectName = "Itinerary App",
  category = "Web Development",
  status = "Ongoing",
  startDate = "2024-01-01",
  endDate = "2024-01-01",
  progress = 70,
  timeInvolved = 4,
  totalDaysInvolved = 32,
}) {
  return (
    <Card className="w-full p-6">
      <CardHeader className="p-0">
        <CardTitle className="text-lg flex justify-between w-full">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-2 mt-2">
        <div className="flex flex-col">
          <p className="font-medium text-sm text-foreground">{projectName}</p>
          <p className="text-sm text-muted-foreground">{category}</p>
        </div>
        <Badge
          variant="subtle"
          className={`${
            status === "Done"
              ? "bg-green-100 text-green-800"
              : status === "Not Started"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          } my-4`}
        >
          <Dot className="mr-1 h-4 w-4" />
          {status}
        </Badge>
        <p className="text-xs mt-4">
          {format(new Date(startDate), "MMM dd, yyyy")} -{" "}
          {format(new Date(endDate), "MMM dd, yyyy")}
        </p>
        <div className="mt-4 flex items-center">
          <Progress value={progress} className="h-1.5" />
          <span className="text-xs ml-2">{progress}%</span>
        </div>
        <div className="mt-4 flex flex-col items-start w-full space-y-4 font-normal">
          <div className="font-medium">Employee Utilization</div>
          <div className="flex justify-start h-full gap-12 w-full">
            <div className="flex flex-col items-start border-r border-muted pr-6">
              <div className="text-sm w-full">Time Involved</div>
              <div className="text-base font-medium text-foreground">
                {timeInvolved} hrs/day
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="text-sm w-full">Total Days Involved</div>
              <div className="text-base font-medium text-foreground">
                {totalDaysInvolved} days
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
