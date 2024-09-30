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

export default function CardLayout({ projects  }) {
  console.log(projects);
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
                {project["name"]}
                <ProjectHealth health={project["health"]} />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <p className="text-xs">{project["projectCategory"]}</p>
              <p className="text-gray-400 text-xs">{project["platform"]}</p>
              <Badge
                variant="subtle"
                className={`${
                  project["status"] === "Done"
                    ? "bg-green-100 text-green-800"
                    : project["status"] === "Not Started"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                } my-4`}
              >
                {project["status"]}
              </Badge>
              <div>
                <p className="text-xs mb-2">Team Members</p>
                <TeamAvatars
                  teamMembersImage={project["teamMembersImage"]}
                  teamMembersCount={project["teamMembersCount"]}
                  size="medium"
                />
              </div>
              <div className="text-xs mt-4">
                {project["startDate"]} - {project["endDate"]}
              </div>
            </CardContent>
            <CardFooter className="p-0 mt-2">
              <Progress value={project["progress"]} className="h-1.5" />
              <span className="ml-2 text-xs">{project["progress"]}%</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
