"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import TeamAvatars from "@/components/TeamAvatars";
import { Badge } from "@/components/ui/badge";
import TableTitle from "@/components/TableTitle";
import ProjectHealth from "@/components/ProjectHealth";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function CardLayout({ projects }) {
  console.log(projects, "projects");
  const router = useRouter();

  const handleCardClick = (projectId) => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  return (
    <div className="flex flex-col gap-4 w-full p-6 border rounded-md">
      <TableTitle
        title="Projects"
        subtitle="View detailed information about all Projects"
        totalItemCount={projects.length}
      />
      <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="w-full p-6 cursor-pointer hover:shadow-md transition-shadow duration-300"
            onClick={() => handleCardClick(project.id)}
          >
            <CardHeader className="p-0">
              <CardTitle className="text-lg p-0">
                {project.name}
                <ProjectHealth health={project.project_health} />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <p className="text-xs">{project.project_category}</p>

              <p className="text-gray-400 text-xs">
                {project.platform || "No data"}
              </p>
              <Badge
                variant="subtle"
                className={`${
                  project.project_status === "1"
                    ? "bg-green-100 text-green-800"
                    : project.project_status === "2"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                } my-4`}
              >
                {project.project_status === "1"
                  ? "Done"
                  : project.project_status === "2"
                  ? "Not Started"
                  : "Ongoing"}
              </Badge>
              <div>
                <p className="text-xs mb-2">Team Members</p>
                <TeamAvatars
                  teamMembersImage={[
                    "/default-avatar.jpg",
                    "/default-avatar.jpg",
                  ]}
                  teamMembersCount={project.all_user_projects.length}
                  size="medium"
                />
              </div>
              <div className="text-xs mt-4">
                {project.start_date && project.end_date
                  ? `${format(
                      new Date(project.start_date),
                      "MMM d, yyyy"
                    )} - ${format(new Date(project.end_date), "MMM d, yyyy")}`
                  : project.start_date
                  ? `${format(
                      new Date(project.start_date),
                      "MMM d, yyyy"
                    )} - No end date`
                  : project.end_date
                  ? `No start date - ${format(
                      new Date(project.end_date),
                      "MMM d, yyyy"
                    )}`
                  : "No dates available"}
              </div>
            </CardContent>
            <CardFooter className="p-0 mt-2">
              <Progress value={project.completion} className="h-1.5" />
              <span className="ml-2 text-xs">
                {project.completion?.toFixed(0)}%
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
