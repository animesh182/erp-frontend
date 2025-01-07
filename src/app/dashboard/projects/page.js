"use client";
import { createClient } from "@/app/api/projects/createClient";
import { createProject } from "@/app/api/projects/createProject";
import { deleteProject } from "@/app/api/projects/deleteProject";
import { editProject } from "@/app/api/projects/editProject";
import { useClients } from "@/app/hooks/client/useClients";
import { useProjectDetails } from "@/app/hooks/projects/useProjects";
import { AddClientDialog } from "@/components/AddClientDialog";
import { EditProjectSheet } from "@/components/EditProjectSheet";
import { ProjectPageSkeletonCard, TitleSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDateRange } from "@/context/dateRangeContext/DateRangeContext";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { LayoutGridIcon, List, PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import CardLayout from "./CardLayout";
import { projectColumns } from "./Columns";
import { formInputs } from "./Inputs";
import { startOfDay, endOfDay } from 'date-fns';

// export default function Projects() {
//   const methods = useForm();
//   const [isSheetOpen, setIsSheetOpen] = useState(false);
//   const [isCardLayout, setIsCardLayout] = useState(false);
//     const { startDate, endDate, setStartDate, setEndDate } = useDateRange();

//     const{data:projects,isLoading:loading,refetch:refetchProject}=useProjectDetails( format(startDate, "yyyy-MM-dd"),format(endDate, "yyyy-MM-dd"))
    
//     const{data:clients,refetch:refetchClient}=useClients()
//     const handleDateChange = (newStartDate, newEndDate) => {
//       setStartDate(newStartDate);
//       setEndDate(newEndDate);
//     };

//   const handleToggleLayout = (value) => {
//     if (value === "grid") {
//       setIsCardLayout(true);
//     } else {
//       setIsCardLayout(false);
//     }
//   };


//   const handleProjectAdd = () => {
//     setIsSheetOpen(true);
//   };

//   const onAddProject = async (formData) => {
//     try {
//       const response = await createProject(formData);
//       toast.success("Project added successfully");
//       refetchProject()
//       setIsSheetOpen(false);
//     } catch (error) {
//       toast.error("Failed to add project");
//       console.error("Error adding project:", error.message);
//     }
//   };

//   const onEditProject = async (projectId, formData) => {
//     try {
//       await editProject(projectId, formData);
//       toast.success("Project updated successfully");
//       refetchProject()
//       setIsSheetOpen(false);
//     } catch (error) {
//       toast.error("Failed to update project");
//       console.error("Error updating project:", error.message);
//     }
//   };

//   const onDeleteProject = async (projectId) => {
//     try {
//       const response = await deleteProject(projectId);
//       if (response && response.message) {
//         toast.success(response.message);
//         refetchProject()
//       }
//     } catch (error) {
//       toast.error("There was an error deleting the project");
//       console.error("There was an error deleting the project:", error);
//     }
//   };

//   const handleClientAdd = async (formData) => {
//     try {
//       await createClient(formData);
//       toast.success("Client added successfully");
//       refetchClient();
//     } catch (error) {
//       toast.error("There was an error adding the client");
//       console.error("Error adding client:", error.message);
//     }
//   };

//   return (
//     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//       <div className="flex items-center justify-between w-full">
//         <div className="flex items-center justify-end gap-2 w-full">
//           <ToggleGroup type="single">
//             <ToggleGroupItem
//               onClick={() => handleToggleLayout("grid")}
//               value="grid"
//               aria-label="Card Layout"
//               className="border rounded-md px-2"
//             >
//               <LayoutGridIcon className="size-5" />
//             </ToggleGroupItem>
//             <ToggleGroupItem
//               onClick={() => handleToggleLayout("list")}
//               value="list"
//               aria-label="List Layout"
//               className="border rounded-md px-2"
//             >
//               <List className="size-5" />
//             </ToggleGroupItem>
//           </ToggleGroup>
//           <Button
//             variant="secondary"
//             size="sm"
//             className="gap-2"
//             onClick={handleProjectAdd}
//           >
//             <PlusCircle className="h-4 w-4" /> Add Project
//           </Button>
//           <AddClientDialog onAddClient={handleClientAdd} />
//         </div>
//       </div>
//       <div className="flex flex-col items-center gap-1 text-left w-full ">
//         {projects && projects.length > 0 || !loading ? (
//           isCardLayout ? (
//             <CardLayout projects={projects} />
//           ) : (
//             <FormProvider {...methods}>
//               <DataTable
//                 columns={projectColumns(clients)}
//                 data={projects}
//                 title={"Projects"}
//                 subtitle={"View detailed information about all Projects"}
//                 isTableAddFormEnabled={false}
//                 formInputs={formInputs}
//                 filterColumn={"project_status"}
//                 onEditRow={onEditProject}
//                 onDeleteRow={onDeleteProject}
//                 onDateChange={handleDateChange}
//                 initialStartDate={startDate}
//                 initialEndDate={endDate}
//                 isMonthPicker={true}
//                 loading={loading}
//               />
//             </FormProvider>
//           )
//         ) : (
//           <div className="flex w-full flex-col gap-y-3 font-semibold">
//             <TitleSkeleton />
//             <ProjectPageSkeletonCard />
//           </div>
//         )}
//       </div>
//       <EditProjectSheet
//         isOpen={isSheetOpen}
//         onClose={() => setIsSheetOpen(false)}
//         onAddProject={onAddProject}
//         clients={clients}
//       />
//     </main>
//   );
// }


export default function Projects() {
  const methods = useForm();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCardLayout, setIsCardLayout] = useState(false);
  const { startDate, endDate, setStartDate, setEndDate } = useDateRange();

  const { data: projects, isLoading: loading, refetch: refetchProject } = useProjectDetails();
  const { data: clients, refetch: refetchClient } = useClients();

  // Filter projects based on start date month using useMemo
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!startDate || !endDate) return projects;

    const start = startOfMonth(startDate);
    const end = endOfMonth(endDate);

    return projects.filter(project => {
      const projectStartDate = new Date(project.start_date);
      return projectStartDate >= start && projectStartDate <= end;
    });
  }, [projects, startDate, endDate]);

  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleToggleLayout = (value) => {
    if (value === "grid") {
      setIsCardLayout(true);
    } else {
      setIsCardLayout(false);
    }
  };

  const handleProjectAdd = () => {
    setIsSheetOpen(true);
  };

  const onAddProject = async (formData) => {
    try {
      const response = await createProject(formData);
      toast.success("Project added successfully");
      refetchProject();
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
      refetchProject();
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
        refetchProject();
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
      refetchClient();
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
      <div className="flex flex-col items-center gap-1 text-left w-full">
        
        {projects && projects.length > 0 || !loading ? (
          isCardLayout ? (
            <CardLayout projects={filteredProjects} />
          ) : (
            <FormProvider {...methods}>
              <DataTable
                columns={projectColumns(clients)}
                data={filteredProjects}
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
                allDate={true}
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