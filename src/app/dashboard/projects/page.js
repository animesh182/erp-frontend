"use client";
import DataTable from "@/components/ui/data-table";
import { LayoutGridIcon, List, MinusCircle, PlusCircle } from "lucide-react";
import React from "react";
import { projectColumns } from "./Columns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import CardLayout from "./CardLayout";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { formInputs } from "./Inputs";
import { EditProjectSheet } from "@/components/EditProjectSheet";
import { toast } from "sonner";
import { useProjects } from "@/hooks/useProjects";
import { AddClientDialog } from "@/components/AddClientDialog";
import { useAddProject, useDeleteProject, useUpdateProject } from "@/sevices/useProjectServices";
import { formatDateApiFormat } from "@/lib/utils";
import { useAddClient } from "@/sevices/useClientServices";






export default function Projects () {
  const methods = useForm();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [isCardLayout, setIsCardLayout] = useState(false);

  const { mutate:editProject } = useUpdateProject();
  const { mutate:addProject } = useAddProject();
  const{mutate:addClient}=useAddClient();
  // handle toggle layout
  const handleToggleLayout = (value) => {
    if (value === "grid") {
      setIsCardLayout(true);
    } else {
      setIsCardLayout(false);
    }
  };

  // const projects = [
  //   {
  //     id: 1,
  //     name: "eBibaaha",
  //     projectCategory: "eBibaaha",
  //     platform: "Web Development",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "John Doe",
  //     clientEmail: "ss@gmail.com",
  //     teamMembersImage: ["/default-avatar.jpg", "/default-avatar.jpg"],
  //     teamMembersCount: 2,
  //     status: "ongoing",
  //     health: "on-track",
  //     progress: 50,
  //     startDate: "Jan 12, 2024",
  //     endDate: "Aug 20, 2024",
  //     budget: 100000,
  //   },
  //   {
  //     id: 2,
  //     name: "FoodieApp",
  //     projectCategory: "Food Delivery",
  //     platform: "Mobile Development",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Alice Smith",
  //     clientEmail: "alice@gmail.com",
  //     teamMembersImage: [
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //     ],
  //     teamMembersCount: 7,
  //     status: "not-started",
  //     health: "on-track",
  //     progress: 30,
  //     startDate: "Feb 1, 2024",
  //     endDate: "Dec 15, 2024",
  //     budget: 200000,
  //   },
  //   {
  //     id: 3,
  //     name: "ShopEasy",
  //     projectCategory: "eCommerce",
  //     platform: "Web Development",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Bob Johnson",
  //     clientEmail: "bob@gmail.com",
  //     teamMembersImage: ["/default-avatar.jpg", "/default-avatar.jpg"],
  //     teamMembersCount: 2,
  //     status: "not-started",
  //     health: "at-risk",
  //     progress: 0,
  //     startDate: "Mar 5, 2024",
  //     endDate: "Sep 30, 2024",
  //     budget: 150000,
  //   },
  //   {
  //     id: 4,
  //     name: "Healthify",
  //     projectCategory: "Health & Fitness",
  //     platform: "Mobile Development",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Charlie Brown",
  //     clientEmail: "charlie@gmail.com",
  //     teamMembersImage: ["/default-avatar.jpg"],
  //     teamMembersCount: 1,
  //     status: "done",
  //     health: "critical",
  //     progress: 100,
  //     startDate: "Apr 10, 2023",
  //     endDate: "Jul 15, 2024",
  //     budget: 120000,
  //   },
  //   {
  //     id: 5,
  //     name: "TravelMate",
  //     projectCategory: "Travel",
  //     platform: "Wix",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Diana Ross",
  //     clientEmail: "diana@gmail.com",
  //     teamMembersImage: ["/default-avatar.jpg", "/default-avatar.jpg"],
  //     teamMembersCount: 2,
  //     status: "ongoing",
  //     health: "on-track",
  //     progress: 65,
  //     startDate: "May 20, 2024",
  //     endDate: "Nov 25, 2024",
  //     budget: 90000,
  //   },
  //   {
  //     id: 6,
  //     name: "EduLearn",
  //     projectCategory: "Education",
  //     platform: "Web Development",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Evan Green",
  //     clientEmail: "evan@gmail.com",
  //     teamMembersImage: [
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //     ],
  //     teamMembersCount: 4,
  //     status: "not-started",
  //     health: "on-track",
  //     progress: 40,
  //     startDate: "Jun 10, 2024",
  //     endDate: "Dec 31, 2024",
  //     budget: 180000,
  //   },
  //   {
  //     id: 7,
  //     name: "FitTrack",
  //     projectCategory: "Health & Fitness",
  //     platform: "Mobile Development",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Frank White",
  //     clientEmail: "frank@gmail.com",
  //     teamMembersImage: ["/default-avatar.jpg", "/default-avatar.jpg"],
  //     teamMembersCount: 2,
  //     status: "not-started",
  //     health: "at-risk",
  //     progress: 0,
  //     startDate: "Jul 15, 2024",
  //     endDate: "Jan 10, 2025",
  //     budget: 110000,
  //   },
  //   {
  //     id: 8,
  //     name: "StyleHub",
  //     projectCategory: "Fashion",
  //     platform: "Wix",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Grace Lee",
  //     clientEmail: "grace@gmail.com",
  //     teamMembersImage: ["/default-avatar.jpg"],
  //     teamMembersCount: 1,
  //     status: "done",
  //     health: "critical",
  //     progress: 100,
  //     startDate: "Aug 5, 2023",
  //     endDate: "Mar 25, 2024",
  //     budget: 140000,
  //   },
  //   {
  //     id: 9,
  //     name: "AutoTrader",
  //     projectCategory: "Automotive",
  //     platform: "Web Development",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Hannah Scott",
  //     clientEmail: "hannah@gmail.com",
  //     teamMembersImage: [
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //     ],
  //     teamMembersCount: 3,
  //     status: "ongoing",
  //     health: "on-track",
  //     progress: 75,
  //     startDate: "Sep 12, 2024",
  //     endDate: "Feb 20, 2025",
  //     budget: 160000,
  //   },
  //   {
  //     id: 10,
  //     name: "FoodConnect",
  //     projectCategory: "Food Delivery",
  //     platform: "Mobile Development",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Ivy King",
  //     clientEmail: "ivy@gmail.com",
  //     teamMembersImage: ["/default-avatar.jpg", "/default-avatar.jpg"],
  //     teamMembersCount: 2,
  //     status: "not-started",
  //     health: "on-track",
  //     progress: 45,
  //     startDate: "Oct 10, 2024",
  //     endDate: "Apr 15, 2025",
  //     budget: 130000,
  //   },
  //   {
  //     id: 11,
  //     name: "EventMaster",
  //     projectCategory: "Event Management",
  //     platform: "Wix",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Jack Martin",
  //     clientEmail: "jack@gmail.com",
  //     teamMembersImage: ["/default-avatar.jpg"],
  //     teamMembersCount: 1,
  //     status: "not-started",
  //     health: "at-risk",
  //     progress: 0,
  //     startDate: "Nov 1, 2024",
  //     endDate: "May 10, 2025",
  //     budget: 100000,
  //   },
  //   {
  //     id: 12,
  //     name: "ShopSmart",
  //     projectCategory: "eCommerce",
  //     platform: "Web Development",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Kate Brown",
  //     clientEmail: "kate@gmail.com",
  //     teamMembersImage: ["/default-avatar.jpg", "/default-avatar.jpg"],
  //     teamMembersCount: 2,
  //     status: "done",
  //     health: "critical",
  //     progress: 100,
  //     startDate: "Dec 20, 2023",
  //     endDate: "Jul 5, 2024",
  //     budget: 170000,
  //   },
  //   {
  //     id: 13,
  //     name: "TechSolutions",
  //     projectCategory: "IT Services",
  //     platform: "Web Development",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Luke Walker",
  //     clientEmail: "luke@gmail.com",
  //     teamMembersImage: [
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //     ],
  //     teamMembersCount: 4,
  //     status: "ongoing",
  //     health: "on-track",
  //     progress: 60,
  //     startDate: "Jan 15, 2024",
  //     endDate: "Aug 25, 2024",
  //     budget: 210000,
  //   },
  //   {
  //     id: 14,
  //     name: "TravelBuddy",
  //     projectCategory: "Travel",
  //     platform: "Mobile Development",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Mia Harris",
  //     clientEmail: "mia@gmail.com",
  //     teamMembersImage: ["/default-avatar.jpg", "/default-avatar.jpg"],
  //     teamMembersCount: 2,
  //     status: "not-started",
  //     health: "on-track",
  //     progress: 35,
  //     startDate: "Feb 25, 2024",
  //     endDate: "Sep 15, 2024",
  //     budget: 190000,
  //   },
  //   {
  //     id: 15,
  //     name: "EduPro",
  //     projectCategory: "Education",
  //     platform: "Web Development",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Noah Clark",
  //     clientEmail: "noah@gmail.com",
  //     teamMembersImage: ["/default-avatar.jpg", "/default-avatar.jpg"],
  //     teamMembersCount: 2,
  //     status: "done",
  //     health: "critical",
  //     progress: 100,
  //     startDate: "Mar 10, 2023",
  //     endDate: "Dec 30, 2023",
  //     budget: 150000,
  //   },
  //   {
  //     id: 16,
  //     name: "FitLife",
  //     projectCategory: "Health & Fitness",
  //     platform: "Mobile Development",
  //     clientImage: "/default-avatar.jpg",
  //     clientName: "Olivia Davis",
  //     clientEmail: "olivia@gmail.com",
  //     teamMembersImage: [
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //       "/default-avatar.jpg",
  //     ],
  //     teamMembersCount: 3,
  //     status: "ongoing",
  //     health: "on-track",
  //     progress: 80,
  //     startDate: "Apr 15, 2024",
  //     endDate: "Dec 20, 2024",
  //     budget: 220000,
  //   },
  // ];




  const handleProjectAdd = () => {
    setIsSheetOpen(true);
  };


  const statusMapping = {
    Done: 1,
    done:1,
    Ongoing:3,
    ongoing: 3,
    "In Progress": 3, 
    "Not-Started": 2,
    "not-started": 2
};

const handleProjectUpdate = (updatedProject) => {
   

  const startDate = new Date(updatedProject.startDate);
  const formattedStartDate = formatDateApiFormat(startDate);


  const endDate = updatedProject.endDate ? new Date(updatedProject.endDate) : new Date(startDate);

  const estimatedDuration = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
    const transformedData = {
      id: updatedProject.id,
      name: updatedProject.name,
      project_health:updatedProject.health.replace(/-/g, '_'),
      client_contact:{
        name:updatedProject.clientName,
        email:updatedProject.clientEmail,
        id:updatedProject.clientId,
        phone_number:updatedProject.clientPhone,
        
      },
      
      project_status: statusMapping[updatedProject.status] || 3 ,
        completion:updatedProject.progress,
        start_date: formattedStartDate,
        estimated_duration: estimatedDuration ,
        budget:updatedProject.budget,
        description:updatedProject.projectDescription,
        type:updatedProject.projectCategory,
        platform:updatedProject.platform
    }
    editProject(transformedData)
    toast.success("Project updated successfully");

  };

  const onAddProject = (formData) => {


    const startDate = new Date(formData.startDate);
    const formattedStartDate = formatDateApiFormat(startDate);
  
  
    const endDate = formData.endDate ? new Date(formData.endDate) : new Date(startDate);
  
    const estimatedDuration = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());

    const transformedData = {
      name: formData.name  || "N/A",
      start_date: formattedStartDate,
      estimated_duration: estimatedDuration, 
      budget: formData.budget,

      description: formData.projectDescription || "",
      client_contact: {
          name: formData.clientName,
          email: formData.clientEmail,
      },
      project_status: statusMapping[formData.status] || 3 ,
      project_health:formData.health.replace(/-/g, '_'),
      project_category: formData.projectCategory || null,
      completion: formData.progress || "0",
      platform: formData.platform || null,


      client:1,
      type:"fixed"
 
  };

  addProject(transformedData)


    toast.success("Project added successfully");
    setIsSheetOpen(false);
  };
const {data:projects,isError,isLoading,error}=useProjects();
const{mutate:deleteProject}=useDeleteProject()
console.log(projects,"proporp")
if(isLoading) return <p>loading....</p>
if(isError) return error.message

  const handleClientAdd = (formData) => {
    const transformedData = {
      name: formData.name || "N/A",
      email: formData.email || "N/A",
      phone_number: formData.phone || "N/A"
    }
    addClient(transformedData)
    toast.success("Client added successfully");
    console.log("Client added", formData);
  };

  return (
    <>
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
       {projects && (isCardLayout ? (
          <CardLayout
         
            projects={projects}
            onProjectUpdate={handleProjectUpdate}
          />
        ) : ( 
          <FormProvider {...methods}>
            <DataTable
              columns={projectColumns(deleteProject)}
              data={projects}

             
           
              title={"Projects"}
              subtitle={"View detailed information about all Projects"}
              isTableAddFormEnabled={false}
              formInputs={formInputs}
              filterColumn={"status"}
              onEditRow={handleProjectUpdate}
            />
          </FormProvider>
        ))}
      </div>
      <EditProjectSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onAddProject={onAddProject}
      />
    </main>
    </>
  );
}
