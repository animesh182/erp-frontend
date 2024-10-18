"use client";
import DataTable from "@/components/ui/data-table";
import { LayoutGridIcon, List, MinusCircle, PlusCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
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
import { getClients } from "@/app/api/projects/getClients";

import { apiClient } from "@/lib/utils";
import { createProject } from "@/app/api/projects/createProject";
import { editProject } from "@/app/api/projects/editProject";
import { createClient } from "@/app/api/projects/createClient";
export default function Projects() {
  const methods = useForm();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [isCardLayout, setIsCardLayout] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshComponent = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  // console.log(projects);
  // handle toggle layout
  const handleToggleLayout = (value) => {
    if (value === "grid") {
      setIsCardLayout(true);
    } else {
      setIsCardLayout(false);
    }
  };

  useEffect(() => {
    const getProjectsFromApi = async () => {
      try {
        const { status, data } = await getProjects();
        if (status === 200) {
          console.log(data, "projects");
          setProjects(data);
        } else {
          console.error("Failed to fetch project data");
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    const getClientsFromApi = async () => {
      try {
        const { status, data } = await getClients();
        if (status === 200) {
          setClients(data);
        } else {
          console.error("Failed to fetch client data");
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
      }
    };

    getProjectsFromApi();
    getClientsFromApi();
  }, [refreshKey]); // Add refreshKey as a dependency

  const handleProjectAdd = () => {
    setIsSheetOpen(true);
  };

  const handleProjectUpdate = (updatedProject) => {
    toast.success("Project updated successfully");
    console.log("Updated Project:", updatedProject);
  };

  const onAddProject = async (formData) => {
    try {
      const response = await createProject(formData);
      toast.success("Project added successfully");
      refreshComponent(); // Refresh the component
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Failed to add project");
      console.error("Error adding project:", error.message);
    }
  };

  const onEditProject = async (projectId, formData) => {
    try {
      await editProject(projectId, formData);
      toast.success("Project updated successfully");
      refreshComponent(); // Refresh the component
      setIsSheetOpen(false);
      setEditingProject(null);
    } catch (error) {
      toast.error("Failed to update project");
      console.error("Error updating project:", error.message);
    }
  };

  const handleClientAdd = async (formData) => {
    try {
      await createClient(formData);
      toast.success("Client added successfully");
      refreshComponent(); // Refresh the component
    } catch (error) {
      toast.error("There was an error adding the client");
      console.error("Error adding client:", error.message);
    }
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
                columns={projectColumns(clients)}
                data={projects}
                title={"Projects"}
                subtitle={"View detailed information about all Projects"}
                isTableAddFormEnabled={false}
                formInputs={formInputs}
                filterColumn={"project_status"}
                onEditRow={onEditProject}
              />
            </FormProvider>
          )
        ) : (
          <div className="text-3xl font-semibold">Loading...</div>
        )}
      </div>
      <EditProjectSheet //this is for add
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onAddProject={onAddProject}
        editingProject={editingProject} // Pass the editing project
        clients={clients}
      />
    </main>
  );
}
