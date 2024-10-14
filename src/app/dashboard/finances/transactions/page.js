"use client";
import React, { useState, useEffect } from "react";
import { columns } from "./Columns";
import DataTable from "@/components/ui/data-table";
import KpiCard from "@/components/kpicard";
import { Activity, CreditCard, DollarSign } from "lucide-react";
import { subDays } from "date-fns";
import { useTheme } from "next-themes";
import { fetchAllTransactions } from "@/app/api/finances/transaction/transactions";
import { fetchTransactionKpi } from "@/app/api/finances/transaction/fetchTransactionKpi";
export default function Transactions() {
  const { theme } = useTheme();

  // Initialize date range
  const initialEndDate = new Date(); // Today's date
  const initialStartDate = subDays(initialEndDate, 28); // 4 weeks ago

  // State to hold date range
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // State to hold transaction data
  const [data, setData] = useState([]);

  // State to hold dynamic KPI data
  const [kpiData, setKpiData] = useState({
    total_revenue: "0",
    total_expenses: "0",
    total_profit: "0",
    changeInRevenue: "0",
    changeInExpenses: "0",
    changeInProfit: "0",
  });

  // State to handle error
  const [error, setError] = useState(null);

  // Fetch KPI data dynamically
  useEffect(() => {
    if (startDate && endDate) {
      const getKpiData = async () => {
        try {
          // Fetch KPI data
          const kpiResponse = await fetchTransactionKpi(startDate, endDate);

          if (kpiResponse.status === 200) {
            // Set KPI data from the response
            const {
              revenue,
              expenses,
              profit,
              changeInRevenue,
              changeInExpenses,
              changeInProfit,
            } = kpiResponse.data;
            setKpiData({
              total_revenue: revenue,
              total_expenses: expenses,
              total_profit: profit,
              changeInRevenue,
              changeInExpenses,
              changeInProfit,
            });
          } else {
            console.error("Failed to fetch KPI data");
            setError(kpiResponse.message || "Error fetching KPI data");
          }
        } catch (error) {
          console.error("Error fetching KPI data:", error);
          setError("An error occurred while fetching KPI data");
        }
      };

      getKpiData();
    }
  }, [startDate, endDate]); // Re-run when date changes

  // Fetch transaction data
  useEffect(() => {
    if (startDate && endDate) {
      const getTransactions = async () => {
        try {
          const response = await fetchAllTransactions(startDate, endDate);

          if (response.status === 200) {
            setData(response.data);
          } else {
            console.error("Failed to fetch transaction data");
            setError(response.message || "Error fetching data");
          }
        } catch (error) {
          console.error("Error fetching transaction data:", error);
          setError("An error occurred while fetching data");
        }
      };

      getTransactions();
    }
  }, [startDate, endDate]); // Re-run when date changes

  console.log(kpiData, "kpiData"); // Log the fetched KPI data

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h2 className="text-lg font-semibold">Overview</h2>

      <div className="flex gap-4 w-full">
        {/* Use dynamic KPI data in the KpiCard components */}
        <KpiCard
          title="Total Revenue"
          value={Number(kpiData.total_revenue)} // Pass the raw number
          change={Number(kpiData.changeInRevenue)} // Pass the raw percentage number
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          period={"month"}
        />
        <KpiCard
          title="Total Expenses"
          value={Number(kpiData.total_expenses)} // Pass the raw number
          change={Number(kpiData.changeInExpenses)} // Pass the raw percentage number
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          period={"month"}
        />
        <KpiCard
          title="Total Profit"
          value={Number(kpiData.total_profit)} // Pass the raw number
          change={Number(kpiData.changeInProfit)} // Pass the raw percentage number
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          period={"month"}
        />
      </div>

      {/* DataTable for Transactions */}
      <DataTable
        title="Transactions"
        subtitle="The table captures all cost streams associated with the company"
        columns={columns}
        data={data}
        onDateChange={handleDateChange}
        initialStartDate={startDate}
        initialEndDate={endDate}
        theme={theme}
      />
    </main>
  );
}
