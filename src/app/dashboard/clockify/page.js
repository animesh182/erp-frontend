"use client"
import { getClockifyProjectSummary } from "@/app/api/clockify/getClockifyProjects";
import PieChartwithBarChart from "@/components/charts/PieChartwithBarChart";
import React, { useEffect, useState } from "react";

const Clockify = () => {
  const [projects, setProjects] = useState();

// const date=new Date()
// const clockifyDate = formatClockifyDate(date);
useEffect(() => {
  const fetchClockifyProjectsReport = async () => {
      try {
          const data = await getClockifyProjectSummary();
          if (data && data.groupOne) {
            const topProjects = data.groupOne
            .sort((a, b) => b.duration - a.duration)
              setProjects(topProjects);
             
          } else {
              console.log("No projects found");
          }
      } catch (error) {
          console.error("Error fetching projects:", error);
      }
  };

  fetchClockifyProjectsReport();
}, []);

// console.log(projects,"proprop")



  return (
    <div className="grid grid-cols-1 p-6 gap-4">
      <span className="font-semibold text-2xl">Clockify</span>
      <div>
        {projects &&<PieChartwithBarChart chartData={projects.map((project, index) => ({
            name: project.name,
            value: (project.duration),
            color: project.color
          }))} />}
      </div>
    </div>
  );
};

export default Clockify;
