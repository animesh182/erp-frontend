"use client";
import { fetchProfitLoss } from "../api/dashboard/fetchProfitLoss";
import { fetchOngoingProjects } from "../api/dashboard/getFinancialStatus";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { subDays, format, startOfDay } from "date-fns";
import { KpiSkeleton, RectangleSkeleton } from "@/components/Skeletons";
import { fetchKpiData } from "@/app/api/fetchKpiData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import ProjectBudgetChart from "@/components/charts/ProjectBudget";
import EmployeeMonthlyHours from "@/components/charts/EmployeeMonthlyHours";
import KpiCard from "@/components/kpicard";
import ProfitLossChart from "@/components/charts/ProfitLoss";
import DateRangePicker from "@/components/DateRangePicker";
import { useState, useEffect } from "react";
import fetchReourceUtil from "@/app/api/dashboard/fetchResourceUtil";
import { useRouter } from "next/navigation";

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

export default function Dashboard() {
  const [profitLoss, setProfitLoss] = useState([]);
  const [resourceUtilData, setResourceUtilData] = useState();
  const [fetchedKpiData, setFetchedKpiData] = useState();
  const [kpiValues, setKpiValues] = useState();
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const initialEndDate = startOfDay(new Date()); // Today's date
  const initialStartDate = startOfDay(subDays(initialEndDate, 28)); // 4 weeks ago
  const [startDate, setStartDate] = useState(
    format(startOfDay(initialStartDate), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(
    format(startOfDay(initialEndDate), "yyyy-MM-dd")
  );

  const router = useRouter();
  useEffect(() => {
    const getProfitLoss = async () => {
      const { status, data } = await fetchProfitLoss();
      if (status === 200) {
        // Transform the data into the required format
        const transformedData = data.monthly_totals.map((monthData) => {
          const { month, net_income, expenses, profit } = monthData;
          // Calculate profit percentage
          const profitPercentage =
            net_income > 0 ? (profit / net_income) * 100 : 0;

          // Map month names to abbreviations
          const monthAbbreviations = {
            January: "Jan",
            February: "Feb",
            March: "Mar",
            April: "Apr",
            May: "May",
            June: "Jun",
            July: "Jul",
            August: "Aug",
            September: "Sep",
            October: "Oct",
            November: "Nov",
            December: "Dec",
          };

          return {
            name: monthAbbreviations[month], // Abbreviated month names
            totalIncome: net_income,
            expenses,
            profit,
            profitPercentage, // This now properly reflects negative profit cases
          };
        });

        setProfitLoss(transformedData); // Set the transformed data to state
      } else {
        console.error("Failed to fetch profit-loss data");
      }
    };

    getProfitLoss();
  }, []);

  // console.log(profitLoss);
  useEffect(() => {
    const getKpiData = async () => {
      const { status, data } = await fetchKpiData(startDate, endDate);
      if (status === 200) {
        setFetchedKpiData(data);
      } else {
        console.error("Failed to fetch KPIs data");
      }
    };

    getKpiData();
  }, [startDate, endDate]);
  useEffect(() => {
    const getResourceUtilData = async () => {
      const { status, data } = await fetchReourceUtil(startDate, endDate);

      if (status === 200) {
        const transformedData = data.map((user) => {
          const userProjects = {};
          user.projects.forEach((project) => {
            userProjects[project.project_name] = project.utilization;
          });
          return {
            name: user.user_name || "Unknown",
            ...userProjects,
          };
        });
        setResourceUtilData(transformedData);
      } else {
        console.error("Failed to fetch KPI data");
      }
    };

    getResourceUtilData();
  }, [startDate, endDate]);

  useEffect(() => {
    const getOngoingProjects = async () => {
      const { status, data } = await fetchOngoingProjects();
      if (status === 200) {
        setOngoingProjects(data.ongoing_projects);
        setCompletedProjects(data.completed_projects);
        // console.log(data, "data");
      } else {
        console.error("Failed to fetch ongoing projects data");
      }
    };

    getOngoingProjects();
  }, []);

  useEffect(() => {
    if (fetchedKpiData) {
      const updatedKpiDatas = [
        {
          title: "Total Revenue",
          value: parseFloat(fetchedKpiData.total_revenue_current_month),
          change: parseFloat(fetchedKpiData.percentage_change_in_revenue),
          period: "month",
          icon: <DollarSign className="w-4 h-4" />,
        },
        {
          title: "Total Profit",
          value: parseFloat(fetchedKpiData.total_profit_current_month),
          change: parseFloat(fetchedKpiData.percentage_change_in_profit),
          period: "month",
          icon: <Activity />,
        },
        {
          title: "Projects",
          value: fetchedKpiData.num_projects_current_month,
          change: parseFloat(fetchedKpiData.percentage_change_in_num_projects),
          period: "month",
          icon: <Users />,
          isMoney: false,
        },
        {
          title: "Employees",
          value: fetchedKpiData.num_employees,
          change: parseFloat(fetchedKpiData.employees_percentage_change),
          period: "month",
          icon: <CreditCard />,
          isMoney: false,
        },
        {
          title: "Invoiced Revenue",
          value: parseFloat(
            fetchedKpiData.total_invoiced_revenue_current_month
          ),
          change: parseFloat(fetchedKpiData.invoiced_revenue_percentage_change),
          period: "month",
          icon: <DollarSign />,
        },
        {
          title: "Total Expense",
          value: fetchedKpiData.total_expenses_current_month,
          change: parseFloat(fetchedKpiData.percentage_change_in_expenses),
          period: "month",
          icon: <CreditCard />,
        },
        {
          title: "Expected Cost",
          value: "N/A",
          change: "N/A",
          period: "month",
          icon: <CreditCard />,
          isMoney: false,
        },
        {
          title: "Expected Liquidity",
          value: "N/A",
          change: "N/A",
          period: "month",
          icon: <CreditCard />,
          isMoney: false,
        },
      ];
      setKpiValues(updatedKpiDatas); // Setting the new kpiDatas array
    }
  }, [fetchedKpiData]); // This will trigger whenever kpiData is fetched

  const handleDateChange = (startDate, endDate) => {
    setStartDate(format(startDate, "yyyy-MM-dd"));
    setEndDate(format(endDate, "yyyy-MM-dd"));
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
      <div className="flex flex-1 flex-col gap-4 md:gap-8 ">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {kpiValues && kpiValues.length > 0
            ? kpiValues.map((data, index) => (
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
              ))
            : // Render skeletons based on expected number of KPI cards
              [...Array(8)].map((_, index) => (
                <div key={index}>
                  <KpiSkeleton />
                </div>
              ))}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-x-6 select-none">
        <Card className="col-span-5 lg:col-span-3 h-full">
          <CardHeader className="flex-row justify-between items-center">
            <CardTitle>
              Profit & Loss
              <div className="text-sm font-normal text-muted-foreground">
                This chart provides a financial overview of the company
              </div>
            </CardTitle>
            <Button
              onClick={() => router.push("/dashboard/finances/projection")}
            >
              View More
            </Button>
          </CardHeader>
          <CardContent className="p-0 w-full h-[600px]">
            <ProfitLossChart data={profitLoss} />
          </CardContent>
        </Card>
        <Card className="col-span-5 lg:col-span-2 h-full">
          <CardHeader className="flex-row justify-between items-center pb-0 ">
            <CardTitle>
              Project Financial Status
              <div className="text-sm font-normal text-muted-foreground">
                This chart provides a financial health of specific projects
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
      <div className="grid grid-cols-5 gap-x-6 select-none">
        <Card className="col-span-5 select-none w-full overflow-hidden">
          <CardHeader className="flex-row justify-between items-center">
            <CardTitle>
              Resource Utilization
              <div className="text-sm font-normal text-muted-foreground">
                This graph shows an overview of all resources in the project
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full h-full min-h-[800px]">
            {resourceUtilData && resourceUtilData.length > 0 ? (
              <EmployeeMonthlyHours rawData={resourceUtilData} />
            ) : resourceUtilData && resourceUtilData.length === 0 ? (
              <div className="text-3xl font-semibold">No Data Available</div>
            ) : (
              <RectangleSkeleton />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
