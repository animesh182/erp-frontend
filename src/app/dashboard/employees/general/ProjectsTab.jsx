"use client";
import { useAssignProject, useDeleteAssignedProject, useEditAssignedProjects } from "@/app/services/useAssignProjectsServices";
import CustomSheetTitle from "@/components/CustomSheetTitle";
import DeleteDialog from "@/components/DeleteDialog";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AssignProjectForm from "./AssignProjectForm";

const ProjectsTab = ({
  employeeId,
  projectOptions,
  roleOptions,
  employeeProjects,
}) => {
  const [localEmployeeProjects, setLocalEmployeeProjects] = useState(
    employeeProjects || []
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const{mutate:assignProjects}=useAssignProject()
  const{mutate:editAssignedProjects}=useEditAssignedProjects()
  const{mutate:deleteAssignedProject}=useDeleteAssignedProject()
  useEffect(() => {
    setLocalEmployeeProjects(employeeProjects || []);
  }, [employeeProjects]);

  const openSheet = (project = null) => {
    setSelectedProject(project);
    setIsSheetOpen(true);
  };

  const onAssignProject = async (values) => {
    try {
      assignProjects(
          { 
            employeeId, 
            projectData: values 
          },
          {
            onSuccess: () => {
              setIsSheetOpen(false)
              setLocalEmployeeProjects((prevProjects) => [
                ...prevProjects,
                {
                  project_title: values.projectTitle,
                  project_name: values.projectName,
                  project_status: "Ongoing",
                  start_date: values.startDate,
                  end_date: values.endDate,
                  completion: 0,
                  utilization: values.utilization,
                  days_involved: 0,
                },
              ]);
            },
          }
        );
    } catch (error) {
      console.error("Failed to assign project:", error);
    }
  };

  const onEditProject = async (userProjectId, values) => {
    try {
      editAssignedProjects(
        {
          userProjectId,
          projectData: values
        },
      {
        onSuccess: () => {
      setIsSheetOpen(false);
      setLocalEmployeeProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.user_project_id === userProjectId
            ? {
                ...project,
                project_name: values.projectName,
                project_role: values.role,
                utilization: values.timeAllocatedPerDay,
                start_date: values.startDate,
                end_date: values.endDate,
              }
            : project
        )
      );
    }
    })
  }
    catch (error) {
      toast.error(error.message || "Failed to edit project");
    }
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };
  const onDeleteProject = (userProjectId) => {
    deleteAssignedProject(userProjectId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setLocalEmployeeProjects((prevProjects) =>
          prevProjects.filter((project) => project.user_project_id !== userProjectId)
        );
      },
      onError: (error) => {
        console.error(error.message || "Failed to delete project");
      },
    });
  };

  if (!localEmployeeProjects) {
    return <div>No Projects</div>;
  }

  const ongoingProjects = localEmployeeProjects.filter(
    (project) => project.project_status !== "Done"
  );
  const completedProjects = localEmployeeProjects.filter(
    (project) => project.project_status === "Done"
  );

  return (
    <div>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        itemName={projectToDelete?.project_name || ""}
        onDelete={() => onDeleteProject(projectToDelete?.user_project_id)}
      />
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <CustomSheetTitle
            title={selectedProject ? "Edit Project Utilization" : "Assign Project"}
            subtitle="Make changes to your task here. Click save when you're done."
          />

          <AssignProjectForm
            projectOptions={projectOptions}
            roleOptions={roleOptions}
            onAssignProject={onAssignProject}
            onEditProject={onEditProject}
            defaultValues={
              selectedProject
                ? {
                    projectName: selectedProject.project_name,
                    role: selectedProject.project_role,
                    timeAllocatedPerDay: selectedProject.utilization,
                    startDate: selectedProject.start_date,
                    endDate: selectedProject.end_date,
                    userProjectId: selectedProject.user_project_id,
                  }
                : undefined
            }
          />
        </SheetContent>
      </Sheet>
      <div className="flex flex-col gap-4 overflow-y-auto p-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-xl">
            Projects ({localEmployeeProjects.length})
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-primary text-white hover:bg-primary cursor-pointer gap-2"
            onClick={() => openSheet()}
          >
            <PlusCircle className="h-4 w-4" /> Assign Project
          </Button>
        </div>

        <Tabs defaultValue="ongoing" className="w-full">
          <TabsList>
            <TabsTrigger value="ongoing">
              Ongoing ({ongoingProjects.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedProjects.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ongoing">
            <div className="space-y-4">
              {ongoingProjects.map((empProject, index) => (
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
                    onEdit={() => openSheet(empProject)}
                    onDelete={() => handleDeleteClick(empProject)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="space-y-4">
              {completedProjects.map((empProject, index) => (
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
                    onEdit={() => openSheet(empProject)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectsTab;
