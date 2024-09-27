"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { subDays, format } from "date-fns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import ProjectBudgetChart from "@/components/charts/ProjectBudget";
import EmployeeMonthlyHours from "@/components/charts/EmployeeMonthlyHours";
import KpiCard from "@/components/kpicard";
import ProfitLossChart from "@/components/charts/ProfitLoss";
import DateRangePicker from "@/components/DateRangePicker";
import { useState, useEffect } from "react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const projectBudget = [
  {
    project: "Basic Booking App",
    totalIncome: 100000,
    expenses: { direct: 2000, fixed: 5000, npa: 50000 },
    isRecurring: true,
  },
  {
    project: "Jambo Booking House",
    totalIncome: 200000,
    expenses: { direct: 3000, fixed: 15000, npa: 170000 },
    isRecurring: true,
  },
  {
    project: "Avinto ERP",
    totalIncome: 1000000,
    expenses: { direct: 3000, fixed: 20000, npa: 500000 },
  },
  {
    project: "Ebibaaha",
    totalIncome: 500000,
    expenses: { direct: 20000, fixed: 100000, npa: 150000 },
  },
  {
    project: "Changeride",
    totalIncome: 500000,
    expenses: { direct: 20000, fixed: 100000, npa: 150000 },
    completed: true,
  },
  {
    project: "Tutor App",
    totalIncome: 500000,
    expenses: { direct: 20000, fixed: 100000, npa: 150000 },
    completed: true,
  },
  {
    project: "Logistikk",
    totalIncome: 500000,
    expenses: { direct: 20000, fixed: 100000, npa: 150000 },
    completed: true,
  },
];
const kpiData = [
  {
    title: "Total Revenue",
    value: 750000,
    change: 20.1,
    period: "month",
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    title: "Total Profit",
    value: 12234,
    change: 19,
    period: "month",
    icon: <Activity />,
  },
  {
    title: "Projects",
    value: "+109",
    change: 180.1,
    period: "month",
    icon: <Users />,
    isMoney: false,
  },
  {
    title: "Employees",
    value: 19,
    change: 10,
    period: "month",
    icon: <CreditCard />,
    isMoney: false,
  },
  {
    title: "Profit Growth",
    value: 750000,
    change: 30,
    period: "month",
    icon: <DollarSign />,
  },
  {
    title: "Expected Revenue",
    value: 3700,
    period: "upcoming month",
    icon: <Activity />,

    isTrend: false,
  },
  {
    title: "Expected Cost",
    value: 2000,
    period: "upcoming month",
    icon: <Users />,
    isTrend: false,
  },
  {
    title: "Expected Liquidity",
    value: 2000,
    period: "upcoming month",
    icon: <CreditCard />,
    isTrend: false,
  },
];
export const profitLossData = [
  {
    name: "Jan",
    totalIncome: 400000,
    expenses: 100000,
    netIncome: 300000, // Actual profit amount
    profitPercentage: 79, // Profit as a percentage
  },
  {
    name: "Feb",
    totalIncome: 180000,
    expenses: 120000,
    netIncome: 60000,
    profitPercentage: 33.33,
  },
  {
    name: "Mar",
    totalIncome: 200000,
    expenses: 100000,
    netIncome: 100000,
    profitPercentage: 50,
  },
  {
    name: "Apr",
    totalIncome: 300000,
    expenses: 150000,
    netIncome: 150000,
    profitPercentage: 50,
  },
  {
    name: "May",
    totalIncome: 350000,
    expenses: 100000,
    netIncome: 250000,
    profitPercentage: 71,
  },
  {
    name: "Jun",
    totalIncome: 400000,
    expenses: 150000,
    netIncome: 250000,
    profitPercentage: 63,
  },
  {
    name: "Jul",
    totalIncome: 500000,
    expenses: 100000,
    netIncome: 400000,
    profitPercentage: 80,
  },
  {
    name: "Aug",
    totalIncome: 450000,
    expenses: 150000,
    netIncome: 300000,
    profitPercentage: 67,
  },
  {
    name: "Sep",
    totalIncome: 500000,
    expenses: 100000,
    netIncome: 400000,
    profitPercentage: 80,
  },
  {
    name: "Oct",
    totalIncome: 600000,
    expenses: 150000,
    netIncome: 450000,
    profitPercentage: 75,
    isProjected: true,
  },
  {
    name: "Nov",
    // totalIncome: 700000,
    // expenses: 100000,
    // netIncome: 600000,
    // profitPercentage: 86,
  },
  {
    name: "Dec",
    // totalIncome: 550000,
    // expenses: 150000,
    // netIncome: 400000,
    // profitPercentage: 73,
  },
];
const ongoingProjects = projectBudget.filter((project) => !project.completed);
const completedProjects = projectBudget.filter((project) => project.completed);
export default function Dashboard() {
  const [resourceUtilData, setResourceUtilData] = useState();
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3MzcyNDc0LCJpYXQiOjE3MjczNjUyNzQsImp0aSI6IjhjZDMxNWE1YjdlNjQ2OTJiYTBiOWUzNDlhN2ViOTQ1IiwidXNlcl9pZCI6Mn0.HnKGk0424TOQh1P4ZZLP714gb_TKmbQJvRhNucsRFhw";
  const initialEndDate = new Date(); // Today's date
  const initialStartDate = subDays(initialEndDate, 28); // 4 weeks ago
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [data, setData] = useState([]); // State to hold the fetched data
  useEffect(() => {
    fetchResourceUtilization();
  }, []);
  useEffect(() => {
    fetchKpiData();
  }, []);
  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  }, [startDate, endDate]);

  const fetchData = (startDate, endDate) => {
    console.log("Fetching data from:", startDate, "to:", endDate);

    const fetchedData = [
      // Add your data here or fetch from your API
    ];
    setData(fetchedData);
  };

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };
  const fetchKpiData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/finance_kpis/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch Kpi data");
      }
      const data = await response.json();
      console.log(data, "kpidata");
    } catch (error) {
      console.error("Failed to fetch the KPI data");
    }
  };
  const fetchResourceUtilization = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/user_projects_utilization/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Replace with your token
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch resource utilization data");
      }

      const data = await response.json();

      const transformedData = data.map((user) => {
        const userProjects = {};
        user.projects.forEach((project) => {
          userProjects[project.project_name] = project.utilization;
        });

        return {
          name: user.user_name || "Unknown", // Handle empty usernames
          ...userProjects,
        };
      });

      setResourceUtilData(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Home</h1>
        <DateRangePicker
          numberOfMonths={2}
          onDateChange={handleDateChange}
          initialStartDate={startDate}
          initialEndDate={endDate}
        />
      </div>
      {/* <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      > */}
      <div className="flex flex-1 flex-col gap-4 md:gap-8 ">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {kpiData.map((data, index) => (
            <div key={index}>
              <KpiCard
                title={data.title}
                value={data.value}
                change={data.change}
                period={data.period}
                icon={data.icon}
                isMoney={data.isMoney}
                isTrend={data.isTrend}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-x-6 w-full select-none">
        <Card className="w-3/5">
          <CardHeader className="flex-row justify-between items-center">
            <CardTitle>
              Profit & Loss
              <div className="text-sm font-normal text-muted-foreground">
                This table caputures all cost streams associated with each
                project
              </div>
            </CardTitle>
            <Button>View More</Button>
          </CardHeader>
          <CardContent className="p-0 w-full h-[400px]">
            <ProfitLossChart data={profitLossData} />
          </CardContent>
        </Card>
        <Card className="w-2/5 h-full">
          <CardHeader className="flex-row justify-between items-center pb-0 ">
            <CardTitle>
              Project Financial Status
              <div className="text-sm font-normal text-muted-foreground">
                This table caputures all cost streams associated with each
                project
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full h-5/6 overflow-hidden px-4 flex justify-center">
            <Tabs
              defaultValue="ongoing"
              className="w-full h-full flex flex-col"
            >
              <TabsList className="self-end">
                <TabsTrigger value="ongoing" className="text-xs">
                  Ongoing
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs">
                  Completed
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ongoing" className="h-full">
                <ProjectBudgetChart rawData={ongoingProjects} />
              </TabsContent>
              <TabsContent value="completed" className="h-full">
                <ProjectBudgetChart rawData={completedProjects} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Card className="select-none">
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle>
            Resource Utilization
            <div className="text-sm font-normal text-muted-foreground">
              This table caputures all cost streams associated with each project
            </div>
          </CardTitle>
          <Button>View More</Button>
        </CardHeader>
        <CardContent>
          <EmployeeMonthlyHours rawData={resourceUtilData} />
        </CardContent>
      </Card>
      {/* </div> */}
    </main>
  );
}
