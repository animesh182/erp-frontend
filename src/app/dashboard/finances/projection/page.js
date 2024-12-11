"use client";
import { fetchProfitLoss } from "@/app/api/dashboard/fetchProfitLoss";
import { fetchKpiData } from "@/app/api/kpiData/fetchKpiData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import ProfitLossChart from "@/components/charts/ProfitLoss";
import { DollarSign, CreditCard, Activity } from "lucide-react";
import KpiCard from "@/components/kpicard";
import ComboboxProjectsWrapper from "@/components/ProjectComboBoxWrapper";
import { format } from "date-fns";
import { getClockifyIdProjects } from "@/app/api/projects/getProjects";
import YearPicker from "@/components/YearPicker";
import { toast } from "sonner";



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
  const [profitLoss, setProfitLoss] = useState([]);

  const [fetchedKpiData, setFetchedKpiData] = useState();
  const [kpiValues, setKpiValues] = useState();
  const[clockifyProjects,setClockifyProjects]=useState()
   const [selectedProject, setSelectedProject] = useState("");
  const[selectedYear,setSelectedYear]=useState()
  const { startDate, endDate } = getYearDateRange(selectedYear);
  useEffect(() => {
    const getProfitLoss = async () => {
      const { status, data } = await fetchProfitLoss(selectedProject,selectedYear);
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
      // if (status === 200) {
      if (status === 200 && Array.isArray(data.monthly_totals)){
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
  }, [selectedProject,selectedYear]);
  useEffect(() => {
    const getKpiData = async () => {
      const { status, data } = await fetchKpiData(
        // format(startDate, "yyyy-MM-dd"),
        // format(endDate, "yyyy-MM-dd"),
        startDate,
        endDate,
        selectedProject
      );
      if (status === 200) {
        setFetchedKpiData(data);
      } else {
        console.error("Failed to fetch KPI data");
      }
    };

    getKpiData();
  }, [selectedProject,selectedYear]);
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



  useEffect(() => {
    const fetchProjectsWIthClockifyId=async()=>{
        try{
        const response=await getClockifyIdProjects(true);
        
        setClockifyProjects(response)
        
    
    
        } catch (error) {
        console.error("Error fetching projects:", error);
    }
    }
    fetchProjectsWIthClockifyId();
}, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
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
        {/* <DateRangePicker
          // numberOfMonths={2}
          onDateChange={handleDateChange}
          initialStartDate={startDate}
          initialEndDate={endDate}
          isMonthPicker={true}
        /> */}

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
    </main>
  );
}
