"use client";

import TableTitle from "@/components/TableTitle";
import SimpleDataTable from "@/components/ui/simple-data-table";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { getProjectById } from "@/app/api/projects/getProjects";
import { columns } from "./Columns";
import ProjectDetailsMain from "./ProjectDetailsMain";
import { useProjectById } from "@/app/hooks/projects/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectPageSkeletonCard, RectangleSkeleton } from "@/components/Skeletons";



export default function EmployeeProjectDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeProjectDetails />
    </Suspense>
  );
}


function EmployeeProjectDetails() {
  const { id } = useParams(); 

    const{data:project,isLoading:loading,refetch:refetchProject}=useProjectById(id)

  // useEffect(() => {
  //   if (id) {
  //     const fetchProjectDetails = async () => {
  //       try {
  //         const { status, data } = await getProjectById(id); 

  //         if (status === 200 && data) {
  //           console.log(data,"data")
  //           setProject(data.data); 
  //         } else {
  //           setError(`Error: ${data.message}`);
  //         }
  //       } catch (err) {
  //         setError("Failed to fetch project details");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchProjectDetails();
  //   }
  // }, [id]);




  return (
    
    <main className="p-6 min-h-screen space-y-16">
      {loading?
      <>
        <RectangleSkeleton/>
        <ProjectPageSkeletonCard/>
        </>
        :
        <>
        
        <ProjectDetailsMain project={project} /> 
      <Card>
        <CardHeader>
        <CardTitle>
        <TableTitle
          title="Resource Utilization"
          subtitle="List of all employees in the project"
          // totalItemCount={6}
          totalItemCount={project?.length}
        />
        </CardTitle>
        </CardHeader>
        <CardContent>
      
        <SimpleDataTable
          columns={columns}
          data={project.all_user_projects}
        />
        </CardContent>
      </Card>
      </>}
    </main>
  );
}


