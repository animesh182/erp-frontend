



"use client";
import { getClockifyProjects, getClockifyProjectSummary } from '@/app/api/clockify/getClockifyProjects';
import { fetchTimeEntries } from '@/app/api/clockify/getUserTimeEntries';
import { getEmployees } from '@/app/api/employees/getEmployees';
import ComboboxEmployees from '@/app/users/leave-request/combobox';
import DoughnutChart from '@/components/charts/PieChart';
import KpiCard from '@/components/kpicard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const formatDurationToHours = (duration) => {
    const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
    const matches = regex.exec(duration);
    if (!matches) return 0;
    let hours = 0;
    let minutes = 0;
  
    if (matches[1]) hours = parseInt(matches[1].replace('H', ''));
    if (matches[2]) minutes = parseInt(matches[2].replace('M', ''));
 
    const totalHours = hours + minutes / 60;
    
    return totalHours >= 1 ? totalHours : 0;
};


function formatDuration(totalSeconds) {
  // Get hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  // Format hours, minutes, and seconds to be always two digits
  const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  
  return formattedTime;
}

function padZero(value) {
  return value < 10 ? '0' + value : value;
}

  const formatClockifyDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const time = "T00:00:00Z";
    return `${year}-${month}-${day}${time}`;
    // return `2024-11-06T00:00:00Z`;
  };



  const processTimeEntries = (timeEntries) => {


    if (!timeEntries || timeEntries.length === 0) {
      return []; 
    }
  return timeEntries.map((entry) => {
      const { description, timeInterval } = entry;
  
      let durationInHours = 0;
      if (timeInterval && timeInterval.duration) {
        durationInHours = formatDurationToHours(timeInterval.duration);
      }
  
      return {
        description,
        duration: durationInHours,
      };
    });
  };


  const DoughnutChartData = (timeEntries) => {
    if (!timeEntries || timeEntries.length === 0) {
      return [
        { name: 'Project A', value: 30, color: '#6875F5' },
        { name: 'Project B', value: 50, color: '#34D399' },
        { name: 'Project C', value: 20, color: '#FBBF24' },
      ];
    }
    const totalWorkedHours = timeEntries.reduce((acc, entry) => acc + entry.duration, 0);
    
    return timeEntries.map((entry, index) => {
      const percentage = (entry.duration / totalWorkedHours) * 100;
      return {
        name: entry.description, // or use project name
        value: percentage,
        color: ["#6875F5", "#34D399", "#FBBF24", "#EF4444"][index % 4], // Example color cycling
      };
    });
  };
  
function ClockifyStats() {
    const [projects, setProjects] = useState();
    const [timeEntries, setTimeEntries] = useState(null);
    const[projectKpiInfo,setProjectKpiInfo]=useState()

  const date=new Date()
  const clockifyDate = formatClockifyDate(date);
  useEffect(() => {
    const fetchClockifyProjectsReport = async () => {
        try {
            const data = await getClockifyProjectSummary();
            if (data && data.groupOne) {
              console.log(data,"dataat")
              const topFiveProjects = data.groupOne
              .sort((a, b) => b.duration - a.duration)
              const totalDuration = topFiveProjects.reduce((acc, project) => acc + project.duration, 0);
        
              const totalAmountByCurrency = data.totals[0].totalAmountByCurrency;
            
                setProjectKpiInfo([totalDuration,totalAmountByCurrency]);
                setProjects(topFiveProjects);
               
            } else {
                console.log("No projects found");
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    fetchClockifyProjectsReport();
}, []);

console.log(projects,"proprop")


    const clockifyData = processTimeEntries(timeEntries);
    // console.log(projectKpiInfo[1,0])
  
  return(
    projects && 
    (<div className="grid grid-cols-3 gap-4">
       <DoughnutChart chartData={projects.map((project, index) => ({
            name: project.name,
            value: (project.duration),
            color: project.color
          }))} />
  </div>)
  )
  }

export default ClockifyStats;







