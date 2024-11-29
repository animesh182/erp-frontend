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
import { fetchTimeEntries } from "@/app/api/clockify/getUserTimeEntries";
import { Card } from "@/components/ui/card";
import ClockifyTimeEntry from "@/components/ClockifyTimeTracking";




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
      console.log(durationInHours,"dddd")
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
      name: entry.description || "(no description)", // or use project name
      value: entry.duration,
      color: ["#6875F5", "#34D399", "#FBBF24", "#EF4444"][index % 4], // Example color cycling
    };
  });
};

const UsersHome = () => {
  const [employeeProjects, setEmployeeProjects] = useState([]);
  const [kpiInfo, setKpiInfo] = useState([]);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [selectedTab, setSelectedTab] = useState("Current Projects");
  const [timeEntries, setTimeEntries] = useState(null);
  const [userData, setUserData] = useState({ email: "", name: "" });
  // const userData = { email: "sankalpa351asdasdasda@gmail.com", name: "Sankalpa Joshi" };

  const date = new Date();
  const clockifyDate = formatClockifyDate(date);

  useEffect(() => {
    const getEmployeeDetails = async () => {
      try {
        const { data, status } = await getEmployeeProjects(userId);
        if (status === 200) {
          setEmployeeProjects(data);
          setUserData({
            email: data[0].user_email,
            name: data[0].user_name,
          });
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
    getEmployeeKpiData();
  }, [userId]);

  useEffect(() => {
    const fetchUserTimeEntries = async () => {
      try {
        const data = await fetchTimeEntries(userData, clockifyDate);
        if (data) {
          const transformedData = data.map((entry) => ({
            timeInterval: entry.timeInterval,
            description: entry.description, // Include description if needed
            projectId: entry.projectId, // Include projectId if needed
          }));

          setTimeEntries(transformedData);
          console.log(timeEntries, "transformedData");
        } else {
          console.log("No time entries found");
        }
      } catch (error) {
        console.error("Error fetching time entries:", error);
      }
    };

    if (userData.email && userData.name) {
      fetchUserTimeEntries();
    }
  }, [userData, clockifyDate]);


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
      value: kpiInfo.total_projects_assigned,
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      title: "Time Allocated",
      value: (
        <div className="text-2xl">
          {kpiInfo.total_time_allocated}{" "}
          <span className="text-muted-foreground text-base">/8 hours</span>
        </div>
      ),
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      title: "Total Sick Leave",
      value: (
        <div className="text-2xl">
          {kpiInfo.total_sick_leave}{" "}
          <span className="text-muted-foreground text-base">/14 days</span>
        </div>
      ),
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      title: "Total Vacation Leave",
      value: (
        <div className="text-2xl">
          {kpiInfo.total_vacation_leave}{" "}
          <span className="text-muted-foreground text-base">/12 days</span>
        </div>
      ),
      icon: <DollarSign className="w-4 h-4" />,
    },
  ];

  const clockifyData = processTimeEntries(timeEntries);


//replace with clockify id of user when backend is ready
const clockifyUserId="671639ea898fb01147870ac8"


const clockifyTimeEntryProp={
  clockifyUserId,
  userName:userData.name
}

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <ClockifyTimeEntry clockifyTimeEntryProp={clockifyTimeEntryProp}/>
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
