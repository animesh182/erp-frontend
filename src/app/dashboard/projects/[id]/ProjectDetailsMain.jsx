import React from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ProjectHealth from "@/components/ProjectHealth";
import { CalendarDaysIcon, Clock, Dot } from "lucide-react";
import { format } from "date-fns";
import KpiCard from "@/components/kpicard";

const ProjectDetailsMain = ({ project }) => (
  <div className="w-full md:w-2/3 space-y-6">
    <div className="w-full rounded-lg border p-6 space-y-4">
      <div className="flex flex-col items-start justify-between space-y-2">
        <div className="flex w-full gap-2 items-center">
          <h2 className="text-2xl font-bold text-foreground">{project.name}</h2>
          <ProjectHealth health={project.health} />
          <Badge
            variant="subtle"
            className={`${
              project.status === "Done"
                ? "bg-green-100 text-green-800"
                : project.status === "Not Started"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            <Dot className="mr-1 h-4 w-4" />
            {project.status.toUpperCase()}
          </Badge>
          <Badge
            variant="outline"
            className="bg-gray-100 text-muted-foreground"
          >
            <Clock className="mr-1 h-4 w-4" />
            {project.daysLeft} DAYS LEFT
          </Badge>
        </div>
        <div className="text-left space-y-2">
          <div className="flex flex-row gap-2">
            <p className="text-lg text-foreground">{project.projectCategory}</p>
            <p className="text-lg text-muted-foreground">{project.platform}</p>
          </div>
          <div className="flex items-center text-sm text-foreground gap-2">
            <CalendarDaysIcon />
            {format(new Date(project.startDate), "MMM dd, yyyy")} -{" "}
            {format(new Date(project.endDate), "MMM dd, yyyy")}
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-foreground">Project Track</h2>
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Project Progress</p>
          <p className="text-3xl font-bold text-foreground">
            {project.progress}%
          </p>
        </div>
        <Separator orientation="vertical" className="h-16" />
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">
            Dev cumulative utilization
          </p>
          <div className="flex items-center gap-2 justify-start w-full">
            <span className="text-green-500 text-sm">↑</span>
            <p className="text-3xl font-bold text-foreground">
              {project.devUtilization}%
            </p>
          </div>
        </div>
        <Separator orientation="vertical" className="h-16" />
        <div>
          <p className="text-sm text-muted-foreground">Team Involved</p>
          <p className="text-3xl font-bold text-foreground">
            {project.teamMembersCount}
          </p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <KpiCard
        title="Project Progress"
        value={`${project.progress}%`}
        subtitle="Current project completion"
      />
      <KpiCard
        title="Dev cumulative utilization"
        value={`${project.devUtilization}%`}
        icon={<span className="text-green-500 text-sm">↑</span>}
        subtitle="Overall developer time usage"
      />
      <KpiCard
        title="Team Involved"
        value={project.teamMembersCount}
        subtitle="Total team members"
      />
    </div>
  </div>
);

export default ProjectDetailsMain;
