"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectDetailsMain from "./ProjectDetailsMain";
import ProjectDetailsSidebar from "./ProjectDetailsSidebar";
import TableTitle from "@/components/TableTitle";
import SimpleDataTable from "@/components/ui/simple-data-table";
import { columns } from "./Columns";

export default function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const dummyProject = {
          id,
          name: "Project Alpha",
          health: "on-track",
          status: "In Progress",
          daysLeft: 45,
          projectCategory: "Automotive",
          platform: "Web Development",
          startDate: "2023-01-01",
          endDate: "2023-12-31",
          progress: 65,
          devUtilization: 80,
          teamMembersCount: 8,
        };
        setProject(dummyProject);
      } catch (err) {
        setError("Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  const dummyEmployeeData = [
    {
      id: "1",
      imageUrl: "/default-avatar.jpg",
      employeeName: "John Doe",
      email: "john.doe@example.com",
      role: "Frontend Developer",
      timeAllocated: "40 hours/week",
      startDate: "2023-01-15",
      endDate: "2023-12-15",
    },
    {
      id: "2",
      imageUrl: "/default-avatar.jpg",
      employeeName: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Backend Developer",
      timeAllocated: "35 hours/week",
      startDate: "2023-02-01",
      endDate: "2023-11-30",
    },
    {
      id: "3",
      imageUrl: "/default-avatar.jpg",
      employeeName: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "UI/UX Designer",
      timeAllocated: "30 hours/week",
      startDate: "2023-01-20",
      endDate: "2023-10-31",
    },
    {
      id: "4",
      imageUrl: "/default-avatar.jpg",
      employeeName: "Bob Williams",
      email: "bob.williams@example.com",
      role: "Project Manager",
      timeAllocated: "45 hours/week",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
    },
    {
      id: "5",
      imageUrl: "/default-avatar.jpg",
      employeeName: "Emma Brown",
      email: "emma.brown@example.com",
      role: "QA Tester",
      timeAllocated: "35 hours/week",
      startDate: "2023-03-01",
      endDate: "2023-11-15",
    },
    {
      id: "6",
      imageUrl: "/default-avatar.jpg",
      employeeName: "Michael Davis",
      email: "michael.davis@example.com",
      role: "DevOps Engineer",
      timeAllocated: "40 hours/week",
      startDate: "2023-02-15",
      endDate: "2023-12-15",
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>No project found</div>;

  return (
    <main className="p-6 min-h-screen space-y-4">
      <div className="flex flex-col md:flex-row gap-4 w-full ">
        <ProjectDetailsMain project={project} />
        <ProjectDetailsSidebar />
      </div>
      <div>
        <TableTitle
          title="Resource Utilization"
          subtitle="List of all employees in the project"
          totalItemCount={dummyEmployeeData.length}
        />
        <SimpleDataTable columns={columns} data={dummyEmployeeData} />
      </div>
    </main>
  );
}
