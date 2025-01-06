"use client";

import { useUserTimeEntries } from "@/app/hooks/clockify/useUserTimeEntries";
import { useEmployeeProjects } from "@/app/hooks/employees/useEmployeeProjects";
import { useEmployeeKpi } from "@/app/hooks/kpiData/useEmployeeKpi";
import DoughnutChart from "@/components/charts/PieChart";
import ClockifyTimeEntry from "@/components/ClockifyTimeTracking";
import KpiCard from "@/components/kpicard";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { DollarSign } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./Columns";

const tabs = ["Current Projects", "Previous Projects"];

const formatClockifyDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const time = "T00:00:00Z";
  return `${year}-${month}-${day}${time}`;
  // return `2024-11-06T00:00:00Z`;
};

const formatDurationToHours = (duration) => {
  // Handle duration format from Clockify (e.g., PT3H14M51S)
  const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
  const matches = regex.exec(duration);

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (matches[1]) hours = parseInt(matches[1].replace("H", ""), 10);
  if (matches[2]) minutes = parseInt(matches[2].replace("M", ""), 10);
  if (matches[3]) seconds = parseInt(matches[3].replace("S", ""), 10);

  // return hours + minutes / 60;
  return hours * 3600 + minutes * 60 + seconds;
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
      console.log(durationInHours, "dddd");
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
      { name: "Project A", value: 30, color: "#6875F5" },
      { name: "Project B", value: 50, color: "#34D399" },
      { name: "Project C", value: 20, color: "#FBBF24" },
    ];
  }
  const totalWorkedHours = timeEntries.reduce(
    (acc, entry) => acc + entry.duration,
    0
  );

  return timeEntries.map((entry, index) => {
    const percentage = (entry.duration / totalWorkedHours) * 100;
    return {
      name: entry.description || "(No description)", // or use project name
      value: entry.duration,
      color: ["#6875F5", "#34D399", "#FBBF24", "#EF4444"][index % 4], // Example color cycling
    };
  });
};

const UsersHome = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [selectedTab, setSelectedTab] = useState("Current Projects");
  // const [timeEntries, setTimeEntries] = useState(null);
  const [userData, setUserData] = useState({ email: "", name: "" });
  const date = new Date();
  const clockifyDate = formatClockifyDate(date);

  const{data:employeeProjects,isLoading}=useEmployeeProjects(userId)
  const { data: kpiInfo } = useEmployeeKpi(userId);



  useEffect(() => {
    if (employeeProjects && employeeProjects.length > 0) {
      setUserData({
        email: employeeProjects[0]?.user_email || '',
        name: employeeProjects[0]?.user_name || '',
      });
    }
  }, [userId,employeeProjects]);


  const{data:timeEntries}=useUserTimeEntries(userData,clockifyDate)

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
    id: project.project_id,
    name: project.project_name,
    project_health: project.project_health,
    timeAllocated: project.utilization,
    status:
      project.project_status === "Not Started"
        ? "Not Started"
        : project.project_status === "Done"
        ? "Completed"
        : "On Going",
    utilization: (project.utilization / 8) * 100, // Assuming totalHours is 8
    startDate: project.start_date,
    endDate: project.end_date || "N/A",
  }));

  const transformedKpiInfo = [
    {
      title: "Total Projects Assigned",
      value: kpiInfo?.total_projects_assigned,
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      title: "Time Allocated",
      value: (
        <div className="text-2xl">
          {kpiInfo?.total_time_allocated?.toFixed(1)}{" "}
          <span className="text-muted-foreground text-base">/8 hours</span>
        </div>
      ),
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      title: "Total Sick Leave",
      value: (
        <div className="text-2xl">
          {kpiInfo?.total_sick_leave}{" "}
          <span className="text-muted-foreground text-base">/{kpiInfo?.allocated_sick_leave + " days" || "14 days"}</span>
        </div>
      ),
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      title: "Total Vacation Leave",
      value: (
        <div className="text-2xl">
          {kpiInfo?.total_vacation_leave}{" "}
          <span className="text-muted-foreground text-base">/{kpiInfo?.allocated_vacation_leave + " days" || "12 days"}</span>
        </div>
      ),
      icon: <DollarSign className="w-4 h-4" />,
    },
  ];

  const clockifyData = processTimeEntries(timeEntries);

  //replace with clockify id of user when backend is ready
  const clockifyUserId = "671639ea898fb01147870ac8";

  const clockifyTimeEntryProp = {
    clockifyUserId,
    userName: userData.name,
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <ClockifyTimeEntry clockifyTimeEntryProp={clockifyTimeEntryProp} />
      {/* <ClockifyTimeEntry userId={clockifyUserId}/> */}
      <div className="flex flex-row space-x-4">
        {transformedKpiInfo &&
          transformedKpiInfo.map((dummyKPICard) => (
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
          {clockifyData && clockifyData.length > 0 ? (
            <DoughnutChart chartData={DoughnutChartData(clockifyData)} />
          ) : (
            <DoughnutChart
              chartData={filteredProjects.map((project, index) => ({
                name: project.project_name,
                value: (project.utilization / 8) * 100,
                color: ["#6875F5", "#34D399", "#FBBF24", "#EF4444"][index % 4], // Example colors
              }))}
            />
          )}
        </div>
        <div className="grid col-span-4 h-full">
          <div className="flex space-x-4 mb-4">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant="employeePageBtn"
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  selectedTab === tab
                    ? "bg-secondary text-ring border border-ring"
                    : "text-muted-foreground hover:bg-secondary"
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
