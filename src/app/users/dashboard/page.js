"use client";

import DoughnutChart from "@/components/charts/PieChart";
import KpiCard from "@/components/kpicard";
import DataTable from "@/components/ui/data-table";
import { DollarSign } from "lucide-react";
import { columns } from "./Columns";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Define dummy KPI data
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

// Define project data
const data = [
  {
    id: 1,
    name: "Website Redesign",
    project_health: "on_track",
    timeAllocated: 8,
    status: "Completed",
    utilization: "85",
    startDate: "2024-01-10",
    endDate: "2024-01-20",
  },
  {
    id: 2,
    name: "App Development",
    project_health: "at_risk",
    timeAllocated: 7.5,
    status: "On Going",
    utilization: "70",
    startDate: "2024-02-01",
    endDate: "2024-06-01",
  },
  {
    id: 3,
    name: "Marketing Campaign",
    project_health: "critical",
    timeAllocated: 6,
    status: "Completed",
    utilization: "90",
    startDate: "2024-03-15",
    endDate: "2024-03-25",
  },
];

const tabs = ["Current Projects", "Previous Projects"];

// Define chart data and config
const chartData = [
  { name: "Jambo Travel House", value: 62, color: "#6875F5" }, // Blue
  { name: "Avinto Test", value: 28, color: "#34D399" }, // Green
  { name: "Changeride", value: 10, color: "#F59E0B" }, // Orange
];

const UsersHome = () => {
  // State to manage selected tab
  const [selectedTab, setSelectedTab] = useState("Current Projects");

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-row space-x-4">
        {dummyKPIInfo.map((dummyKPICard) => (
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
        <div className="  col-span-2 justify-center w-full ">
          <DoughnutChart chartData={chartData} />
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
              data={data}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default UsersHome;