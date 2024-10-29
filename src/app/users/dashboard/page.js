"use client";

import DoughnutChart from "@/components/charts/PieChart";
import KpiCard from "@/components/kpicard";
import DataTable from "@/components/ui/data-table";
import { DollarSign } from "lucide-react";
import { columns } from "./Columns";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { getEmployeeProjects } from "@/app/api/employees/getEmployeeProjects";
import { getEmployeeKpi } from "@/app/api/employees/getEmployeeKpi";

const dummyKPIInfo = [
  {
    title: "Total Projects Assigned",
    value: "3",
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    title: "Time Allocated",
    value: (
      <div className="text-2xl">
        8 <span className="text-muted-foreground text-base">/8 hours</span>
      </div>
    ),
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    title: "Total Sick Leave",
    value: (
      <div className="text-2xl">
        4 <span className="text-muted-foreground text-base">/14 days</span>
      </div>
    ),
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    title: "Total Vacation Leave",
    value: (
      <div className="text-2xl">
        6 <span className="text-muted-foreground text-base">/12 days</span>
      </div>
    ),
    icon: <DollarSign className="w-4 h-4" />,
  },
];

const tabs = ["Current Projects", "Previous Projects"];

const UsersHome = () => {
  const [employeeProjects, setEmployeeProjects] = useState([]);
  const [kpiInfo, setKpiInfo] = useState([]);
  const searchParams = useSearchParams(); 
  const userId = searchParams.get('userId');  
  const [selectedTab, setSelectedTab] = useState("Current Projects");

  useEffect(() => {
    const getEmployeeDetails = async () => {
      try {
        const { data, status } = await getEmployeeProjects(userId);
        if (status === 200) {
          setEmployeeProjects(data);
        } else {
          console.error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } 
    };
    const getEmployeeKpiData = async () => {
      try {
        const data = await getEmployeeKpi(userId);
    
        if (data) {
          setKpiInfo(data);
        } else {
          console.error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } 
    };

    getEmployeeDetails();
    getEmployeeKpiData()
  }, [userId]);

  const filteredProjects = Array.isArray(employeeProjects) 
  ? employeeProjects.filter((project) => {


      const endDate = new Date(project.end_date);
      const today = new Date();

      if (selectedTab === "Previous Projects") {
    
        return project.end_date && endDate < today; 
      } else {
     
        return !project.end_date || endDate >= today; 
      }
    })
  : [];

  const transformedData = filteredProjects.map((project) => ({
    id:project.project_id,
    name: project.project_name,
    project_health: project.project_health,
    timeAllocated: project.utilization,
    status: project.project_status === "Not Started" 
             ? "Not Started" 
             : project.project_status === "Done" 
             ? "Completed" 
             : "On Going",
    utilization: (project.utilization / 8) * 100, // Assuming totalHours is 8
    startDate: project.start_date,
    endDate: project.end_date || "N/A",
  }));



  const transformedKpiInfo=[
   
      {
        title: "Total Projects Assigned",
        value: kpiInfo.total_projects_assigned,
        icon: <DollarSign className="w-4 h-4" />,
      },
      {
        title: "Time Allocated",
        value: (
          <div className="text-2xl">
            {kpiInfo.total_time_allocated} <span className="text-muted-foreground text-base">/8 hours</span>
          </div>
        ),
        icon: <DollarSign className="w-4 h-4" />,
      },
      {
        title: "Total Sick Leave",
        value: (
          <div className="text-2xl">
            {kpiInfo.total_sick_leave} <span className="text-muted-foreground text-base">/14 days</span>
          </div>
        ),
        icon: <DollarSign className="w-4 h-4" />,
      },
      {
        title: "Total Vacation Leave",
        value: (
          <div className="text-2xl">
            {kpiInfo.total_vacation_leave} <span className="text-muted-foreground text-base">/12 days</span>
          </div>
        ),
        icon: <DollarSign className="w-4 h-4" />,
      },
    
  ]


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-row space-x-4">
        {transformedKpiInfo && transformedKpiInfo.map((dummyKPICard) => (
          <KpiCard
            key={dummyKPICard.title}
            title={dummyKPICard.title}
            value={dummyKPICard.value}
            icon={dummyKPICard.icon}
            hasSubText={false}
            isMoney={false}
          />
        ))}
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-8 py-4 px-0 max-h-[320px]">
        <div className="col-span-2 justify-center w-full">
          <DoughnutChart chartData={filteredProjects.map((project, index) => ({
            name: project.project_name,
            value: (project.utilization / 8) * 100,
            color: ["#6875F5", "#34D399", "#FBBF24", "#EF4444"][index % 4] // Example colors
          }))} />
        </div>
        <div className="grid col-span-4 h-full">
          <div className="flex space-x-4 mb-4">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant="employeePageBtn"
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  selectedTab === tab
                    ? "bg-blue-50 text-blue-600 border border-blue-500"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
          <div className="flex items-start h-full min-h-[400px]">
            <DataTable
              title={"Project Assigned"}
              subtitle={"View and analyze projects assigned to you."}
              columns={columns}
              data={transformedData}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default UsersHome;
