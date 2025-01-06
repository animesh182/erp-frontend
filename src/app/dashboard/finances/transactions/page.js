"use client";
import { useTransaction } from "@/app/hooks/finances/useTransaction";
import { ProjectPageSkeletonCard } from "@/components/Skeletons";
import DataTable from "@/components/ui/data-table";
import { useDateRange } from "@/context/dateRangeContext/DateRangeContext";
import { format } from "date-fns";
import { columns } from "./Columns";

export default function Transactions() {
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
