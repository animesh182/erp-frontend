"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectDetailsMain from "./ProjectDetailsMain";
import ProjectDetailsSidebar from "./ProjectDetailsSidebar";
import TableTitle from "@/components/TableTitle";
import SimpleDataTable from "@/components/ui/simple-data-table";
import { columns } from "./Columns";
import { deleteResourceUtilization } from "@/app/api/projects/deleteResourceUtilization";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TabFilters from "@/components/TabFilters";
import { isAfter } from "date-fns";
import { getProjectById } from "@/app/api/projects/getProjects";

export default function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Ongoing');
  const { id } = useParams();

  // Function to determine resource status
  const getResourceStatus = (endDate) => {
    if (!endDate) return "Ongoing"; // No end date means ongoing
    
    const currentDate = new Date();
    const resourceEndDate = new Date(endDate);
    
    return isAfter(currentDate, resourceEndDate) ? "Completed" : "Ongoing";
  };

  // Filter resources based on selected tab
  const filterResourcesByStatus = (resources, status) => {
    // if (status === 'All') return resources;
    
    return resources.filter(resource => {
      const resourceStatus = getResourceStatus(resource.end_date);
      return resourceStatus === status;
    });
  };

  useEffect(() => {
    if (id) {
      const fetchProjectDetails = async () => {
        try {
          const { status, data } = await getProjectById(id);
          if (status === 200 && data) {
            setProject(data.data);
          } else {
            setError(`Error: ${data.message}`);
          }
        } catch (err) {
          setError("Failed to fetch project details");
        } finally {
          setLoading(false);
        }
      };

      fetchProjectDetails();
    }
  }, [id]);


  const onDeleteRow = async (resourceId) => {
    try {
      await deleteResourceUtilization(resourceId);
      toast.success("Resource utilization deleted successfully");
    } catch (error) {
      toast.error("Error deleting resource utilization");
      console.error("Error deleting resource utilization:", error);
    }
  };

  // Filter values as simple string array
  const filterValues = [ 'Ongoing', 'Completed'];

  // Filter the resources based on selected tab
  const filteredResources = project 
    ? filterResourcesByStatus(project.all_user_projects, selectedTab) 
    : [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>No project found</div>;

  return (
    <main className="p-6 min-h-screen space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
        <ProjectDetailsMain project={project} />
        {!isDescriptionOpen && (
          <Button onClick={() => setIsDescriptionOpen(true)} variant="outline">
            Description
          </Button>
        )}
        {isDescriptionOpen && (
          <ProjectDetailsSidebar
            project={project}
            onClose={() => setIsDescriptionOpen(false)}
          />
        )}
      </div>
      <div>
        <TableTitle
          title="Resource Utilization"
          subtitle="List of all employees in the project"
          totalItemCount={filteredResources.length}
        />
        <TabFilters
          filterValues={filterValues}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <SimpleDataTable
          columns={columns}
          data={filteredResources}
          onDeleteRow={onDeleteRow}
        />
      </div>
    </main>
  );
}