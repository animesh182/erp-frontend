"use client";
import DataTable from "@/components/ui/data-table";
import { LayoutGridIcon, List, MinusCircle, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { projectColumns } from "./Columns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import CardLayout from "./CardLayout";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { formInputs } from "./Inputs";
import { EditProjectSheet } from "@/components/EditProjectSheet";
import { toast } from "sonner";
import { AddClientDialog } from "@/components/AddClientDialog";
import { getProjects } from "@/app/api/getProjects";
import {
  KpiSkeleton,
  RectangleSkeleton,
  SkeletonCard,
} from "@/components/Skeletons";
import { apiClient } from "@/lib/utils";
export default function Projects() {
  const methods = useForm();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isCardLayout, setIsCardLayout] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // console.log(projects);
  // handle toggle layout
  const handleToggleLayout = (value) => {
    if (value === "grid") {
      setIsCardLayout(true);
    } else {
      setIsCardLayout(false);
    }
  };

  const projectsExample = [
    {
      id: 1,
      name: "eBibaaha",
      projectCategory: "eBibaaha",
      platform: "Web Development",
      clientImage: "/default-avatar.jpg",
      clientName: "John Doe",
      clientEmail: "ss@gmail.com",
      teamMembersImage: ["/default-avatar.jpg", "/default-avatar.jpg"],
      teamMembersCount: 2,
      status: "ongoing",
      health: "on-track",
      progress: 50,
      startDate: "Jan 12, 2024",
      endDate: "Aug 20, 2024",
      budget: 100000,
    },
  ];

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

  const handleProjectAdd = () => {
    setIsSheetOpen(true);
  };

  const handleProjectUpdate = (updatedProject) => {
    toast.success("Project updated successfully");
    console.log("Updated Project:", updatedProject);
  };

  const onAddProject = async (formData) => {
    try {
      const response = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project/`,
        {
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            amount: formData.budget,
            start_date: formData.startDate,
            budget: formData.budget,
            type: formData.projectCategory || "default_type", // Ensure `type` is not blank
            client: formData.clientName, // Fix this field (see below)
            project_status: formData.status,
            completion: formData.progress,
            project_health: formData.health,
            platform: formData.platform,
            client_email: formData.clientEmail,
            teamMembersCount: formData.teamMembersCount,
            end_date: formData.endDate,
            project_description: formData.projectDescription,
          }),
        }
      );

      toast.success("Project added successfully");

      // Update the projects state with the newly added project
      setProjects((prevProjects) => [...prevProjects, response]);

      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Failed to add project");
      console.error("Error adding project:", error.message);
    }
  };

  const onEditProject = async (projectId, formData) => {
    console.log(projectId, "client");
    try {
      // Use apiClient to make the PUT request
      const response = await apiClient(`/api/project/${projectId}`, {
        method: "PUT", // Use PUT for updating
        body: JSON.stringify({
          name: formData.name,
          amount: formData.budget,
          start_date: formData.startDate,
          budget: formData.budget,
          type: formData.projectCategory,
          client: formData.clientName, // Ensure this is the client ID (PK), not the name
          project_status: formData.status,
          completion: formData.progress,
          project_health: formData.health,
          platform: formData.platform,
          client_email: formData.clientEmail,
          teamMembersCount: formData.teamMembersCount,
          end_date: formData.endDate,
          project_description: formData.projectDescription,
        }),
      });

      toast.success("Project updated successfully");

      // Update the projects state with the updated project
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? response : project
        )
      );

      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Failed to update project");
      console.error("Error updating project:", error.message);
    }
  };

  const handleClientAdd = (formData) => {
    toast.success("Client added successfully");
    console.log("Client added", formData);
  };
  const handleProjectEdit = (project) => {
    setEditingProject(project); // Set the project to be edited
    setIsSheetOpen(true); // Open the sheet
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-end gap-2 w-full">
          <ToggleGroup type="single">
            <ToggleGroupItem
              onClick={() => handleToggleLayout("grid")}
              value="grid"
              aria-label="Card Layout"
              className="border rounded-md px-2"
            >
              <LayoutGridIcon className="size-5" />
            </ToggleGroupItem>
            <ToggleGroupItem
              onClick={() => handleToggleLayout("list")}
              value="list"
              aria-label="List Layout"
              className="border rounded-md px-2"
            >
              <List className="size-5" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={handleProjectAdd}
          >
            <PlusCircle className="h-4 w-4" /> Add Project
          </Button>
          <AddClientDialog onAddClient={handleClientAdd} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 text-left w-full ">
        {projects && projects.length > 0 ? (
          isCardLayout ? (
            <CardLayout
              projects={projects}
              onProjectUpdate={handleProjectUpdate}
            />
          ) : (
            <FormProvider {...methods}>
              <DataTable
                columns={projectColumns}
                data={projects}
                title={"Projects"}
                subtitle={"View detailed information about all Projects"}
                isTableAddFormEnabled={false}
                formInputs={formInputs}
                filterColumn={"status"}
                onEditRow={handleProjectUpdate}
              />
            </FormProvider>
          )
        ) : (
          <div className="text-3xl font-semibold">Loading...</div>
        )}
      </div>
      <EditProjectSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onAddProject={onAddProject}
        onEditProject={onEditProject}
        editingProject={editingProject} // Pass the editing project
      />
    </main>
  );
}
