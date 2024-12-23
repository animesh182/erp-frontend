"use client";
import { getTransactions } from "@/app/api/transactions/getTransactions";
import DataTable from "@/components/ui/data-table";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { columns } from "./Columns";
import { fetchTransactionKpi } from "@/app/api/kpiData/fetchTransactionKpi";
import KpiCard from "@/components/kpicard";
import { Activity, CreditCard, DollarSign } from "lucide-react";
import { useDateRange } from "@/context/dateRangeContext/DateRangeContext";
import { ProjectPageSkeletonCard } from "@/components/Skeletons";
import { useTransaction } from "@/app/hooks/finances/useTransaction";

export default function Transactions() {
  // Get first day of current month
  // const initialStartDate = startOfMonth(new Date());
  // // Get last day of current month
  // const initialEndDate = endOfMonth(new Date());

  // const [startDate, setStartDate] = useState(
  //   format(initialStartDate, "yyyy-MM-dd")
  // );
  // const [endDate, setEndDate] = useState(format(initialEndDate, "yyyy-MM-dd"));

  // State to hold transaction data
  // const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
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
    const { startDate, endDate, setStartDate, setEndDate } = useDateRange();
    const {data,isLoading}=useTransaction( format(startDate, "yyyy-MM-dd"),format(endDate, "yyyy-MM-dd"))
    const handleDateChange = (newStartDate, newEndDate) => {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    };

  // Fetch KPI data dynamically
  // useEffect(() => {
  //   if (startDate && endDate) {
  //     const getKpiData = async () => {
  //       try {
  //         // Fetch KPI data
  //         const kpiResponse = await fetchTransactionKpi(
  //           format(startDate, "yyyy-MM-dd"),
  //           format(endDate, "yyyy-MM-dd")
  //         );

  //         if (kpiResponse.status === 200) {
  //           // Set KPI data from the response
  //           const {
  //             revenue,
  //             expenses,
  //             profit,
  //             changeInRevenue,
  //             changeInExpenses,
  //             changeInProfit,
  //           } = kpiResponse.data;
  //           setKpiData({
  //             total_revenue: revenue,
  //             total_expenses: expenses,
  //             total_profit: profit,
  //             changeInRevenue,
  //             changeInExpenses,
  //             changeInProfit,
  //           });
  //         } else {
  //           console.error("Failed to fetch KPI data");
  //           setError(kpiResponse.message || "Error fetching KPI data");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching KPI data:", error);
  //         setError("An error occurred while fetching KPI data");
  //       }
  //     };

  //     getKpiData();
  //   }
  // }, [startDate, endDate]); // Re-run when date changes

  // Fetch transaction data
  // useEffect(() => {
  //   if (startDate && endDate) {
  //     fetchData(startDate, endDate);
  //   }
  // }, [startDate, endDate]);

  // const fetchData = async (startDate, endDate) => {
  //   console.log("Fetching data from:", startDate, "to:", endDate);
  //   try {
  //     const fetchedData = await getTransactions(
  //       format(startDate, "yyyy-MM-dd"),
  //       format(endDate, "yyyy-MM-dd")
  //     );
  //     console.log(fetchedData, "transactions data");
  //     setData(fetchedData);
  //   } catch (error) {
  //     console.error("Error fetching transactions:", error);
  //   } finally{
  //     setIsLoading(false)
  //   }
  // };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {/* <h2 className="text-lg font-semibold">Overview</h2>  */}
       {/* <div className="flex gap-4 w-full">
        <KpiCard
          title="Total Revenue"
          value={Number(kpiData.total_revenue)} 
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
      </div> */}

      {isLoading ? (
    <ProjectPageSkeletonCard/>
    ) : (
      <DataTable
        title="Transactions"
        subtitle="The table captures all cost streams associated with the company"
        columns={columns}
        data={data}
        onDateChange={handleDateChange}
        initialStartDate={startDate}
        initialEndDate={endDate}
        isMonthPicker={true}
      />
    )}


    </main>
  );
}
