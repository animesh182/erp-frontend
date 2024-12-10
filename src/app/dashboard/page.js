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
import { format, startOfMonth, endOfMonth } from "date-fns";
import { KpiSkeleton, RectangleSkeleton } from "@/components/Skeletons";
import { fetchKpiData } from "@/app/api/fetchKpiData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import ProjectBudgetChart from "@/components/charts/ProjectBudget";
import EmployeeMonthlyHours from "@/components/charts/EmployeeMonthlyHours";
import KpiCard from "@/components/kpicard";
import ProfitLossChart from "@/components/charts/ProfitLoss";
import DateRangePicker from "@/components/DateRangePicker";
import { useState, useEffect, useMemo } from "react";
import fetchReourceUtil from "@/app/api/dashboard/fetchResourceUtil";
import { useRouter } from "next/navigation";
import { getClockifyIdProjects } from "../api/projects/getProjects";
import ComboboxProjectsWrapper from "@/components/ProjectComboBoxWrapper";
import ProfitAnalysisMargin from "@/components/ProfitAnalysisMargin";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";




export default function Dashboard() {
  const [profitLoss, setProfitLoss] = useState([]);
  const [resourceUtilData, setResourceUtilData] = useState();
  const [fetchedKpiData, setFetchedKpiData] = useState();
  const [kpiValues, setKpiValues] = useState();
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const[clockifyProjects,setClockifyProjects]=useState()
   const [selectedProject, setSelectedProject] = useState("");

  const initialStartDate = startOfMonth(new Date());
  const initialEndDate = endOfMonth(new Date());

  const [startDate, setStartDate] = useState(
    format(initialStartDate, "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(initialEndDate, "yyyy-MM-dd"));

  const router = useRouter();
  useEffect(() => {
    const getProfitLoss = async () => {
      const { status, data } = await fetchProfitLoss(selectedProject);
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
      if (status === 200 && Array.isArray(data.monthly_totals)) {
        // Transform the data into the required format
        const transformedData = data.monthly_totals.map((monthData) => {
          const { month, net_income, expenses, profit } = monthData;
          // Calculate profit percentage
          const profitPercentage =
            net_income > 0 ? (profit / net_income) * 100 : 0;

          // Map month names to abbreviations

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
        toast.error("Failed to fetch profit-loss data ")
        const defaultData = Object.values(monthAbbreviations).map((month) => ({
          name: month,
          totalIncome: 0,
          expenses: 0,
          profit: 0,
          profitPercentage: 0,
        }));
        setProfitLoss(defaultData)
      }
    };
    getProfitLoss();
  }, [selectedProject]);

  // console.log(profitLoss);
  useEffect(() => {
    const getKpiData = async () => {
      const { status, data } = await fetchKpiData(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd"),
        selectedProject
      );
      if (status === 200) {
        setFetchedKpiData(data);
      } else {
        console.error("Failed to fetch KPIs data");
      }
    };

    const getResourceUtilData = async () => {
      const { status, data } = await fetchReourceUtil(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd"),
        selectedProject
      );

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
    getKpiData();
  }, [startDate, endDate,selectedProject]);


  useEffect(() => {
    if (fetchedKpiData) {
      const updatedKpiDatas = {
        totalActualData: [
          {
            title: "Actual Revenue",
            value: parseFloat(fetchedKpiData.actual_revenue),
            change: parseFloat(fetchedKpiData.actual_revenue_percentage_change),
            period: "month",
            icon: <DollarSign className="w-4 h-4" />,
          },
          {
            title: "Actual Expense",
            value: fetchedKpiData.actual_cost,
            change: parseFloat(fetchedKpiData.actual_cost_percentage_change),
            period: "month",
            icon: <CreditCard />,
          },
          {
            title: "Actual Profit",
            value: parseFloat(fetchedKpiData.actual_profit),
            change: parseFloat(fetchedKpiData.actual_profit_percentage_change),
            period: "month",
            icon: <Activity />,
          },
        ],
        invoicedData: [
          {
            title: "Invoiced Revenue",
            value: parseFloat(fetchedKpiData.invoiced_revenue),
            change: parseFloat(fetchedKpiData.invoiced_revenue_percentage_change),
            period: "month",
            icon: <DollarSign />,
          },
          {
            title: "Invoiced Cost",
            value: parseFloat(fetchedKpiData.invoiced_cost),
            change: parseFloat(fetchedKpiData.invoiced_cost_percentage_change),
            period: "month",
            icon: <DollarSign />,
          },
          {
            title: "Invoiced profit",
            value: parseFloat(fetchedKpiData.invoiced_profit),
            change: parseFloat(fetchedKpiData.invoiced_profit_percentage_change),
            period: "month",
            icon: <DollarSign />,
          },
        ],
        budgetedData: [
          {
            title: "Budgeted Revenue",
            value: parseFloat(fetchedKpiData.budgeted_revenue),
            change: parseFloat(fetchedKpiData.budgeted_revenue_percentage_change),
            period: "month",
            icon: <CreditCard />,
            isMoney: false,
          },
          {
            title: "Budgeted Expense",
            value: parseFloat(fetchedKpiData.budgeted_cost),
            change: parseFloat(fetchedKpiData.budgeted_cost_percentage_change),
            period: "month",
            icon: <CreditCard />,
            isMoney: false,
          },
          {
            title: "Budgeted Profit",
            value: parseFloat(fetchedKpiData.budgeted_profit),
            change: parseFloat(fetchedKpiData.budgeted_profit_percentage_change),
            period: "month",
            icon: <CreditCard />,
            isMoney: false,
          },
        ],
        otherData: [
          {
            title: "Projects",
            value: fetchedKpiData.num_projects,
            change: parseFloat(fetchedKpiData.projects_percentage_change),
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
        ],
      };
      
      setKpiValues(updatedKpiDatas); // Setting the new kpiDatas array
      setLoading(false);
    }
  }, [fetchedKpiData]); // This will trigger whenever kpiData is fetched

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(format(endOfMonth(new Date(endDate)), "yyyy-MM-dd"));
  };



  const renderKpiSection = (sectionData, skeletonCount) => {
    return (
      <div className="space-y-2  w-11/12">
        {kpiValues?.[sectionData] && kpiValues[sectionData].length > 0
          ? kpiValues[sectionData].map((data, index) => (
     
              <KpiCard
                key={index}
                title={data.title}
                value={data.value}
                change={data.change}
                period={data.period}
                icon={data.icon}
                isMoney={data.isMoney}
                isTrend={data.isTrend}
                isSmall={true}
              />
           
            ))
          : [...Array(skeletonCount)].map((_, index) => <KpiSkeleton key={index} isSmall={true} />)}
      </div>
    );
  };

  useEffect(() => {
    const fetchProjectsWIthClockifyId=async()=>{
        try{
        const response=await getClockifyIdProjects(true);
        
        setClockifyProjects(response)
        
    
    
        } catch (error) {
        console.error("Error fetching projects:", error);
    }
    }
    const getOngoingProjects = async () => {
      const { status, data } = await fetchOngoingProjects();
      if (status === 200) {
        setOngoingProjects(data.ongoing_projects);
        setCompletedProjects(data.completed_projects);
        console.log(data, "datasdasa");
      } else {
        console.error("Failed to fetch ongoing projects data");
      }
    };

    getOngoingProjects();
    fetchProjectsWIthClockifyId();
}, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Home</h1>
        <div className="flex gap-2">
          <ComboboxProjectsWrapper
              clockifyProjects={clockifyProjects}
              selectedProject={selectedProject}
              onProjectSelect={setSelectedProject}
            />
        <DateRangePicker
          // numberOfMonths={2}
          onDateChange={handleDateChange}
          initialStartDate={startDate}
          initialEndDate={endDate}
          isMonthPicker={true}
        />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 md:gap-8 ">
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        
          <div className="space-y-2">
            <h2 className="font-semibold text-xl text-center ">Actual</h2>
            {renderKpiSection('totalActualData', 3)}
          </div> 

          <div className="space-y-2">
          <h2 className="font-semibold text-xl text-center ">Invoiced</h2>
            {renderKpiSection('invoicedData', 2)}
            </div>
            <div className="space-y-2">
            <h2 className="font-semibold text-xl text-center">Budgeted</h2>
            {renderKpiSection('budgetedData', 3)}
            </div>
          <div className="space-y-2">
          <h2 className="font-semibold text-xl text-center">Others</h2>
          {renderKpiSection('otherData', 2)}
          </div>
        </div>

      </div>
      <ProfitAnalysisMargin profitLoss={profitLoss} ongoingProjects={ongoingProjects} completedProjects={completedProjects}/>
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
