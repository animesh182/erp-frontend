"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dot } from "lucide-react";
import { format } from "date-fns";
import { useEmployeeProjects } from "@/hooks/useEmployees";
import { useProjectById, useProjectz } from "@/hooks/useProjects";

export function ProjectCard({ userId }) {
  const { data: employeeProjects, isLoading: employeeLoading, isError: employeeError, error } = useEmployeeProjects(userId);
  

  const projectIds = employeeProjects?.map(project => project.projectId) || [];
  console.log("projectIds:", projectIds);

  const { data: projectsData, isLoading: projectsLoading, isError: projectsError } = useProjectById(projectIds);

  console.log("projectsData:", projectsData);

  if (employeeLoading || projectsLoading) return <p>Loading....</p>;
  if (employeeError) return <p>{error.message}</p>;
  if (projectsError) return <p>Error loading project details</p>;

  if (!employeeProjects || employeeProjects.length === 0) {
    return (
      <Card className="w-full p-6">
        <CardContent className="p-0 space-y-2 mt-2">
          <p>No projects available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {employeeProjects && projectsData && (
        <Card className="w-full p-6">
           {employeeProjects.map((project) => {
        const projectData = projectsData?.find(p => p.id === project.projectId);
        if (!projectData) return null;

              return (
                <React.Fragment key={project.projectId}>
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg flex justify-between w-full">
                      {projectData.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-2 mt-2">
                    <div className="flex flex-col">
                      <p className="font-medium text-sm text-foreground">{projectData.projectName}</p>
                      <p className="text-sm text-muted-foreground">{project.category}</p>
                    </div>
                    <Badge
                      variant="subtle"
                      className={`${
                        project.status === "Done"
                          ? "bg-green-100 text-green-800"
                          : project.status === "Not Started"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      } my-4`}
                    >
                      <Dot className="mr-1 h-4 w-4" />
                      {project.status}
                    </Badge>
                    <p className="text-xs mt-4">
                      {project?.startDate ? (
                        format(new Date(project.startDate), "MMM dd, yyyy")
                      ) : (
                        "Start Date Not Specified"
                      )}{" "}
                      -{" "}
                      {project?.endDate ? (
                        format(new Date(project.endDate), "MMM dd, yyyy")
                      ) : (
                        "End Date Not Specified"
                      )}
                    </p>
                    <div className="mt-4 flex items-center">
                      <Progress value={projectData.progress} className="h-1.5" />
                      <span className="text-xs ml-2">{projectData.progress}%</span>
                    </div>
                    <div className="mt-4 flex flex-col items-start w-full space-y-4 font-normal">
                      <div className="font-medium">Employee Utilization</div>
                      <div className="flex justify-start h-full gap-12 w-full">
                        <div className="flex flex-col items-start border-r border-muted pr-6">
                          <div className="text-sm w-full">Time Involved</div>
                          <div className="text-base font-medium text-foreground">
                            {project.timeInvolved} hrs/day
                          </div>
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="text-sm w-full">Total Days Involved</div>
                          <div className="text-base font-medium text-foreground">
                            {project.totalDaysInvolved} days
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </React.Fragment>
              );
            })
 } 
        </Card>
      )}
    </>
  );
}
