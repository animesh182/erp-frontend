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
          <ProjectHealth health={project.project_health} />

          {/* Add a check for project_status */}
          <Badge
            variant="subtle"
            className={`${
              project.project_status === 1
                ? "bg-green-100 text-green-800"
                : project.project_status === 2
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            <Dot className="mr-1 h-4 w-4" />
            {/* Ensure project.project_status exists and map to a status */}
            {project.project_status === 1
              ? "DONE"
              : project.project_status === 2
              ? "NOT STARTED"
              : "ONGOING"}
          </Badge>

          <Badge
            variant="outline"
            className="bg-gray-100 text-muted-foreground"
          >
            <Clock className="mr-1 h-4 w-4" />
            {project.daysLeft ? `${project.daysLeft} DAYS LEFT` : "N/A"}
          </Badge>
        </div>
        <div className="text-left space-y-2">
          <div className="flex flex-row gap-2">
            <p className="text-lg text-foreground">
              {project.project_category || "No Category"}
            </p>
            <p className="text-lg text-muted-foreground">
              {project.platform || "No Platform"}
            </p>
          </div>
          <div className="flex items-center text-sm text-foreground gap-2">
            <CalendarDaysIcon />
            {project.start_date
              ? format(new Date(project.start_date), "MMM dd, yyyy")
              : "N/A"}{" "}
            -{" "}
            {project.end_date
              ? format(new Date(project.end_date), "MMM dd, yyyy")
              : "N/A"}
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-foreground">Project Track</h2>
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Project Progress</p>
          <p className="text-3xl font-bold text-foreground">
            {project.completion ? `${project.completion}%` : "N/A"}
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
              {project.devUtilization ? `${project.devUtilization}%` : "N/A"}
            </p>
          </div>
        </div>
        <Separator orientation="vertical" className="h-16" />
        <div>
          <p className="text-sm text-muted-foreground">Team Involved</p>
          <p className="text-3xl font-bold text-foreground">
            {project.all_user_projects.length || "N/A"}
          </p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <KpiCard
        title="Project Progress"
        value={`${project.completion}%` || "N/A"}
        subtitle="Current project completion"
      />
      <KpiCard
        title="Dev cumulative utilization"
        value={`${project.devUtilization}%` || "N/A"}
        icon={<span className="text-green-500 text-sm">↑</span>}
        subtitle="Overall developer time usage"
      />
      <KpiCard
        title="Team Involved"
        value={project.all_user_projects.length || "N/A"}
        subtitle="Total team members"
      />
    </div>
  </div>
);

export default ProjectDetailsMain;
