"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TableTitle from "@/components/TableTitle";
import SimpleDataTable from "@/components/ui/simple-data-table";

import { getProjectById } from "@/app/api/getProjects";
import ProjectDetailsMain from "./ProjectDetailsMain";
import ProjectDetailsSidebar from "@/app/dashboard/projects/[id]/ProjectDetailsSidebar";
import { columns } from "./Columns";



function EmployeeProjectDetails() {
  const [project, setProject] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const { id } = useParams(); 

  useEffect(() => {
    if (id) {
      const fetchProjectDetails = async () => {
        try {
          const { status, data } = await getProjectById(id); 

          if (status === 200 && data) {
            setProject(data); 
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



  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;


  if (!project) return <div>No project found</div>;

  
  // console.log(columns,"coliulaskdnkjabsd")

  return (
    
    <main className="p-6 min-h-screen space-y-4">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <ProjectDetailsMain project={project} /> 
        <ProjectDetailsSidebar project={project} />
      </div>
      <div>
        <TableTitle
          title="Resource Utilization"
          subtitle="List of all employees in the project"
          // totalItemCount={6}
          totalItemCount={project?.all_user_projects.length}
        />
      
        <SimpleDataTable
          columns={columns}
          data={project.all_user_projects}
          // onDeleteRow={onDeleteRow}
        />
      </div>
    </main>
  );
}


export default function EmployeeProjectDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeProjectDetails />
    </Suspense>
  );
}