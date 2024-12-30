"use client";
import EmployeeMonthlyHours from "@/components/charts/EmployeeMonthlyHours";
import DateRangePicker from "@/components/DateRangePicker";
import KpiCard from "@/components/kpicard";
import ProfitAnalysisMargin from "@/components/ProfitAnalysisMargin";
import ComboboxProjectsWrapper from "@/components/ProjectComboBoxWrapper";
import { KpiSkeleton, ProfitAnalysisMarginSkeleton, RectangleSkeleton } from "@/components/Skeletons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useDateRange } from "@/context/dateRangeContext/DateRangeContext";
import { format } from "date-fns";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useOngoingProjects } from "../hooks/dashboard/useOngoingProjects";
import { useProfitLoss } from "../hooks/dashboard/useProfitLoss";
import { useResourceUtil } from "../hooks/dashboard/useResourceUtil";
import { useKpi } from "../hooks/kpiData/useKpiData";
import { useClockifyProjects } from "../hooks/projects/useClockifyProjects";

export default function Dashboard() {
  // const [profitLoss, setProfitLoss] = useState([]);
  const [kpiValues, setKpiValues] = useState();
  const [loading, setLoading] = useState(true);
  // const [clockifyProjects, setClockifyProjects] = useState();
  const [selectedProject, setSelectedProject] = useState("");

    const { startDate, endDate, setStartDate, setEndDate } = useDateRange();
  
    const formattedStartDate=format(startDate, "yyyy-MM-dd")
    const formattedEndDate=format(endDate, "yyyy-MM-dd")
    const { data:fetchedKpiData,isLoading:kpiIsLoading } = useKpi( formattedStartDate,formattedEndDate, selectedProject);
    const { data:resourceUtilData,isLoading:utilIsLoading } = useResourceUtil(  formattedStartDate,formattedEndDate, selectedProject);
    const { data:profitLoss,isLoading :profitLossIsLoading } = useProfitLoss(  selectedProject,startDate?.getFullYear());
    const { data:projects,isLoading :projectsIsLoading } = useOngoingProjects(formattedStartDate,formattedEndDate);
    const { data:clockifyProjects, isLoading:clockifyProjectsIsLoading } = useClockifyProjects(true);

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
            change: parseFloat(
              fetchedKpiData.invoiced_revenue_percentage_change
            ),
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
            change: parseFloat(
              fetchedKpiData.invoiced_profit_percentage_change
            ),
            period: "month",
            icon: <DollarSign />,
          },
        ],
        budgetedData: [
          {
            title: "Budgeted Revenue",
            value: parseFloat(fetchedKpiData.budgeted_revenue),
            change: parseFloat(
              fetchedKpiData.budgeted_revenue_percentage_change
            ),
            period: "month",
            icon: <CreditCard />,
            isMoney: true,
          },
          {
            title: "Budgeted Expense",
            value: parseFloat(fetchedKpiData.budgeted_cost),
            change: parseFloat(fetchedKpiData.budgeted_cost_percentage_change),
            period: "month",
            icon: <CreditCard />,
            isMoney: true,
          },
          {
            title: "Budgeted Profit",
            value: parseFloat(fetchedKpiData.budgeted_profit),
            change: parseFloat(
              fetchedKpiData.budgeted_profit_percentage_change
            ),
            period: "month",
            icon: <CreditCard />,
            isMoney: true,
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

  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const renderKpiSection = (sectionData, skeletonCount) => {
    return (
      <div className="space-y-2  w-11/12">
        {kpiValues?.[sectionData] && kpiValues[sectionData].length > 0 && !kpiIsLoading
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
          : [...Array(skeletonCount)].map((_, index) => (
              <KpiSkeleton key={index} isSmall={false} />
            ))}
      </div>
    );
  };


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
            {renderKpiSection("totalActualData", 3)}
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-xl text-center ">Invoiced</h2>
            {renderKpiSection("invoicedData", 3)}
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold text-xl text-center">Budgeted</h2>
            {renderKpiSection("budgetedData", 3)}
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold text-xl text-center">Others</h2>
            {renderKpiSection("otherData", 2)}
          </div>
        </div>
      </div>

      {(profitLossIsLoading || projectsIsLoading) ? (
    <ProfitAnalysisMarginSkeleton/>
  ) : (
    <ProfitAnalysisMargin
      profitLoss={profitLoss || []}
      ongoingProjects={projects?.ongoingProjects || []}
      completedProjects={projects?.completedProjects || []}
    />
  )}
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
            {!utilIsLoading && resourceUtilData?.length > 0 ? (
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
