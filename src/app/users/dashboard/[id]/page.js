"use client";

import TableTitle from "@/components/TableTitle";
import SimpleDataTable from "@/components/ui/simple-data-table";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { getProjectById } from "@/app/api/projects/getProjects";
import { columns } from "./Columns";
import ProjectDetailsMain from "./ProjectDetailsMain";



export default function EmployeeProjectDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeProjectDetails />
    </Suspense>
  );
}


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
            console.log(data,"data")
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



  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;


  if (!project) return <div>No project found</div>;


  return (
    
    <main className="p-6 min-h-screen space-y-4">
   
        <ProjectDetailsMain project={project} /> 
      <br/>
      <br/>
      <div>
        <TableTitle
          title="Resource Utilization"
          subtitle="List of all employees in the project"
          // totalItemCount={6}
          totalItemCount={project?.length}
        />
      
        <SimpleDataTable
          columns={columns}
          data={project.all_user_projects}
        />
      </div>
    </main>
  );
}


