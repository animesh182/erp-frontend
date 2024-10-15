"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import AssignProjectForm from "./AssignProjectForm";
import CustomSheetTitle from "@/components/CustomSheetTitle";
import { ProjectCard } from "@/components/ProjectCard";
import { assignProject } from "@/app/api/employees/assignProject";
import { toast } from "sonner";
import { getProjects } from "@/app/api/getProjects";
import { getRoles } from "@/app/api/employees/getEmployees";
const ProjectsTab = ({ employeeId, projectOptions, roleOptions, userId }) => {
  // console.log(employeeProjects, "emp");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [roles, setRoles] = useState([]);

  const openSheet = () => setIsSheetOpen(true);

  const onAssignProject = async (values) => {
    try {
      const response = await assignProject(employeeId, values);
      console.log("Project assigned successfully:", response);
      toast.success("Project assigned successfully");
      setIsSheetOpen(false);
      // You might want to update the UI or state here
    } catch (error) {
      console.error("Failed to assign project:", error);
      toast.error(error.message || "Failed to assign project");
      // Handle the error (e.g., show an error message to the user)
    }
  };

  return (
    <div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <CustomSheetTitle
            title="Assign Project"
            subtitle="Make changes to your task here. Click save when you're done."
          />

          <AssignProjectForm
            projectOptions={projectOptions}
            roleOptions={roleOptions}
            onAssignProject={onAssignProject}
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
