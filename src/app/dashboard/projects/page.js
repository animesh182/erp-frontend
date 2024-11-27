"use client";
import DataTable from "@/components/ui/data-table";
import { LayoutGridIcon, List, PlusCircle } from "lucide-react";
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
import { format, startOfMonth, endOfMonth } from "date-fns";
import { createProject } from "@/app/api/projects/createProject";
import { editProject } from "@/app/api/projects/editProject";
import { createClient } from "@/app/api/projects/createClient";
import { deleteProject } from "@/app/api/projects/deleteProject";
import { ProjectPageSkeletonCard, TitleSkeleton } from "@/components/Skeletons";

export default function Projects() {
  const methods = useForm();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [isCardLayout, setIsCardLayout] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initialize date states
  const initialStartDate = startOfMonth(new Date());
  const initialEndDate = endOfMonth(new Date());
  const [startDate, setStartDate] = useState(
    format(initialStartDate, "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(initialEndDate, "yyyy-MM-dd"));

  const refreshComponent = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

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
        setLoading(true);
        const { status, data } = await getProjects(startDate, endDate);
        if (status === 200) {
          setProjects(data);
        } else {
          console.error("Failed to fetch project data");
          toast.error("Failed to fetch project data");
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
        toast.error("Error fetching project details");
      } finally {
        setLoading(false);
      }
    };

    const getClientsFromApi = async () => {
      try {
        const { status, data } = await getClients();
        if (status === 200) {
          setClients(data);
        } else {
          console.error("Failed to fetch client data");
          toast.error("Failed to fetch client data");
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
        toast.error("Error fetching client details");
      }
    };

    getProjectsFromApi();
    getClientsFromApi();
  }, [refreshKey, startDate, endDate]);

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(format(endOfMonth(new Date(endDate)), "yyyy-MM-dd"));
  };

  const handleProjectAdd = () => {
    setIsSheetOpen(true);
  };

  const onAddProject = async (formData) => {
    try {
      const response = await createProject(formData);
      toast.success("Project added successfully");
      refreshComponent();
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
      refreshComponent();
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Failed to update project");
      console.error("Error updating project:", error.message);
    }
  };

  const onDeleteProject = async (projectId) => {
    try {
      const response = await deleteProject(projectId);
      if (response && response.message) {
        toast.success(response.message);
        refreshComponent();
      }
    } catch (error) {
      toast.error("There was an error deleting the project");
      console.error("There was an error deleting the project:", error);
    }
  };

  const handleClientAdd = async (formData) => {
    try {
      await createClient(formData);
      toast.success("Client added successfully");
      refreshComponent();
    } catch (error) {
      toast.error("There was an error adding the client");
      console.error("Error adding client:", error.message);
    }
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
            <CardLayout projects={projects} />
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
                onDeleteRow={onDeleteProject}
                onDateChange={handleDateChange}
                initialStartDate={startDate}
                initialEndDate={endDate}
                isMonthPicker={true}
                loading={loading}
              />
            </FormProvider>
          )
        ) : (
          <div className="flex w-full flex-col gap-y-3 font-semibold">
            <TitleSkeleton />
            <ProjectPageSkeletonCard />
          </div>
        )}
      </div>
      <EditProjectSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onAddProject={onAddProject}
        clients={clients}
      />
    </main>
  );
}
