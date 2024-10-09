"use client";
import { fetchProfitLoss } from "@/app/api/dashboard/fetchProfitLoss";
import { fetchKpiData } from "@/app/api/dashboard/fetchKpiData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
// import { Activity, CreditCard, DollarSign } from "lucide-react";
import { profitLossData } from "../../page";
import ProfitLossChart from "@/components/charts/ProfitLoss";
import { DollarSign, CreditCard, Activity } from "lucide-react";
import KpiCard from "@/components/kpicard";

const kpiData = [
  {
    title: "Total Revenue",
    value: 750000,
    change: 20.1,
    period: "month",
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    title: "Total Expenses",
    value: 550000,
    change: 19,
    period: "month",
    icon: <CreditCard />,
  },
  {
    title: "Total Profit",
    value: 200000,
    change: 19,
    period: "month",
    icon: <Activity />,
  },
];
export const projectionData = [
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
    totalIncome: 500000,
    expenses: 100000,
    netIncome: 400000,
    profitPercentage: 80,
    isProjected: true,
  },
  {
    name: "Dec",
    totalIncome: 450000,
    expenses: 150000,
    netIncome: 300000,
    profitPercentage: 67,
    isProjected: true,
  },
];
export default function ProfitLoss() {
  const [profitLoss, setProfitLoss] = useState([]);

  const [fetchedKpiData, setFetchedKpiData] = useState();
  const [kpiValues, setKpiValues] = useState();
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
  useEffect(() => {
    const getKpiData = async () => {
      const { status, data } = await fetchKpiData();
      if (status === 200) {
        setFetchedKpiData(data);
      } else {
        console.error("Failed to fetch KPI data");
      }
    };

    getKpiData();
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
          title: "Total Expense",
          value: fetchedKpiData.total_expenses_current_month,
          change: parseFloat(fetchedKpiData.percentage_change_in_expenses),
          period: "month",
          icon: <CreditCard />,
        },
      ];
      setKpiValues(updatedKpiDatas); // Setting the new kpiDatas array
    }
  }, [fetchedKpiData]); // This will trigger whenever kpiData is fetched

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle>
            Revenue Projection
            <div className="text-sm font-normal text-muted-foreground">
              Capture and track all cost streams associated with each project in
              this table.
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full h-[500px] flex justify-between">
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
