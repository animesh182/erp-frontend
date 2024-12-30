"use client";
import { useProfitLoss } from "@/app/hooks/dashboard/useProfitLoss";
import { useKpi } from "@/app/hooks/kpiData/useKpiData";
import { useClockifyProjects } from "@/app/hooks/projects/useClockifyProjects";
import ProfitLossChart from "@/components/charts/ProfitLoss";
import KpiCard from "@/components/kpicard";
import ComboboxProjectsWrapper from "@/components/ProjectComboBoxWrapper";
import { RectangleSkeleton } from "@/components/Skeletons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import YearPicker from "@/components/YearPicker";
import { format } from "date-fns";
import { Activity, CreditCard, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";



function getYearDateRange(year = new Date().getFullYear()) {
  if (!year || isNaN(year)) {
    throw new Error("Invalid year provided");
  }

  const start_date = new Date(`${year}-01-01`);
  const end_date = new Date(`${year}-12-31`);
  const startDate=format(start_date, "yyyy-MM-dd")
  const endDate=format(end_date, "yyyy-MM-dd")

  return { startDate, endDate };
}
export default function ProfitLoss() {
  const [kpiValues, setKpiValues] = useState();
   const [selectedProject, setSelectedProject] = useState("");
  const[selectedYear,setSelectedYear]=useState()
  const { startDate, endDate } = getYearDateRange(selectedYear);


  const{data:clockifyProjects}=useClockifyProjects(true)
  const{data:fetchedKpiData}=useKpi( startDate,endDate,selectedProject)
  const{data:profitLoss,isLoading}=useProfitLoss(selectedProject,selectedYear)

  useEffect(() => {
    if (fetchedKpiData) {
      const updatedKpiDatas = [
        {
          title: "Total Revenue",
          value: parseFloat(fetchedKpiData.actual_revenue),
          change: parseFloat(fetchedKpiData.actual_revenue_percentage_change),
          period: "month",
          icon: <DollarSign className="w-4 h-4" />,
        },
        {
          title: "Total Profit",
          value: parseFloat(fetchedKpiData.actual_profit),
          change: parseFloat(fetchedKpiData.actual_profit_percentage_change),
          period: "month",
          icon: <Activity />,
        },

        {
          title: "Total Expense",
          value: fetchedKpiData.actual_cost,
          change: parseFloat(fetchedKpiData.actual_cost_percentage_change),
          period: "month",
          icon: <CreditCard />,
        },
      ];
      setKpiValues(updatedKpiDatas); // Setting the new kpiDatas array
    }
  }, [fetchedKpiData]); // This will trigger whenever kpiData is fetched

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {isLoading?<RectangleSkeleton isSmall={false}/> :
      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle className="flex justify-between w-full">
            <div>
            Revenue Projection
            <div className="text-sm font-normal text-muted-foreground">
              Capture and track all cost streams associated with each project in
              this table.
            </div>
            </div>
            <div className="flex gap-2">
          <ComboboxProjectsWrapper
              clockifyProjects={clockifyProjects}
              selectedProject={selectedProject}
              onProjectSelect={setSelectedProject}
            />


        <YearPicker
                initialYear={new Date().getFullYear()}
                selectedYear={selectedYear}
                onYearSelect={setSelectedYear}
              />

        </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full h-[600px] flex justify-between">
          <div className="w-2/3 h-full select-none">
            <ProfitLossChart data={profitLoss} />
          </div>
          <div className="flex flex-col space-y-6 w-1/3">
            {kpiValues &&
              kpiValues.length > 0 &&
              kpiValues.map((data, index) => {
                return (
                  <KpiCard
                    key={index}
                    title={data.title}
                    value={data.value}
                    change={data.change}
                    period={data.period}
                    icon={data.icon}
                    isMoney={data.isMoney}
                    isTrend={data.isTrend}
                  />
                );
              })}
          </div>
        </CardContent>
      </Card>
}
    </main>
  );
}
