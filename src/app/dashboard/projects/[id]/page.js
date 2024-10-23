"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use `useParams` from `next/navigation`
import ProjectDetailsMain from "./ProjectDetailsMain";
import ProjectDetailsSidebar from "./ProjectDetailsSidebar";
import TableTitle from "@/components/TableTitle";
import SimpleDataTable from "@/components/ui/simple-data-table";
import { columns } from "./Columns";
import { getProjectById } from "@/app/api/getProjects"; // Import the API function to get project by ID
import { deleteResourceUtilization } from "@/app/api/projects/deleteResourceUtilization";
import { toast } from "sonner";
export default function ProjectDetails() {
  const [project, setProject] = useState(null); // Project state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { id } = useParams(); // Get the projectId from the dynamic route

  useEffect(() => {
    if (id) {
      const fetchProjectDetails = async () => {
        try {
          const { status, data } = await getProjectById(id); // Fetch project details by ID

          if (status === 200 && data) {
            setProject(data); // Set the project state with the response data
          } else {
            setError(`Error: ${data.message}`);
          }
        } catch (err) {
          setError("Failed to fetch project details");
        } finally {
          setLoading(false); // Set loading to false after fetch
        }
      };

      fetchProjectDetails(); // Fetch the project details using projectId
    }
  }, [id]);

  const onDeleteRow = async (userId, projectId) => {
    try {
      await deleteResourceUtilization(userId, projectId);
      toast.success("Resource utilization deleted successfully");
    } catch (error) {
      toast.error("Error deleting resource utilization");
      console.error("Error deleting resource utilization:", error);
    }
  };

  // Show loading while fetching data
  if (loading) return <div>Loading...</div>;

  // Show error if fetching fails
  if (error) return <div>Error: {error}</div>;

  // Show "No project found" if project is null or empty
  if (!project) return <div>No project found</div>;

  // Render the project details
  return (
    <main className="p-6 min-h-screen space-y-4">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <ProjectDetailsMain project={project} /> {/* Pass the project data */}
        <ProjectDetailsSidebar project={project} />
      </div>
      <div>
        <TableTitle
          title="Resource Utilization"
          subtitle="List of all employees in the project"
          totalItemCount={6}
        />
        <SimpleDataTable
          columns={columns}
          data={project.all_user_projects}
          onDeleteRow={onDeleteRow}
        />
      </div>
    </main>
  );
}
