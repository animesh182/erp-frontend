"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import AssignProjectForm from "./AssignProjectForm";
import CustomSheetTitle from "@/components/CustomSheetTitle";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/app/api/getProjects";
import { getRoles } from "@/app/api/employees/getEmployees";
const ProjectsTab = ({ employeeProjects, userId }) => {
  // console.log(employeeProjects, "emp");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [roles, setRoles] = useState([]);

  const openSheet = () => setIsSheetOpen(true);
  useEffect(() => {
    const getProjectsFromApi = async () => {
      try {
        const { status, data } = await getProjects();
        if (status === 200) {
          setProjects(data);
        } else {
          console.error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    getProjectsFromApi();
  }, []);
  useEffect(() => {
    const getRolesFromApi = async () => {
      try {
        const { status, data } = await getRoles();
        if (status === 200) {
          setRoles(data);
        } else {
          console.error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    getRolesFromApi();
  }, []);
  return (
    <div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <CustomSheetTitle
            title="Assign Project"
            subtitle="Make changes to your task here. Click save when you're done."
          />

          <AssignProjectForm
            projects={projects}
            roles={roles}
            userId={userId}
          />
        </SheetContent>
      </Sheet>
      <div className="flex flex-col gap-4 overflow-y-auto p-6 space-y-2">
        <div className="flex items-center justify-between ">
          <div className="font-semibold text-xl">
            Current projects ({employeeProjects?.length})
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-primary text-white hover:bg-primary cursor-pointer gap-2"
            onClick={openSheet}
          >
            <PlusCircle className="h-4 w-4" /> Assign Project
          </Button>
        </div>
        {employeeProjects?.map((empProject, index) => {
          return (
            <div key={index}>
              <ProjectCard
                title={empProject.project_title}
                projectName={empProject.project_name}
                category="Category N/A"
                status={empProject.project_status}
                startDate={empProject.start_date}
                endDate={empProject.end_date}
                progress={empProject.completion}
                timeInvolved={empProject.utilization}
                totalDaysInvolved={empProject.days_involved}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsTab;
