"use client";
import React, { useState, useEffect } from "react";

import { columns } from "./Columns";
import DataTable from "@/components/ui/data-table";
import KpiCard from "@/components/kpicard";
import { Activity, CreditCard, DollarSign } from "lucide-react";
import { subDays, format } from "date-fns";
import { getTransactions } from "@/app/api/transactions/getTransactions";

export default function Transactions() {
  const initialEndDate = new Date(); // Today's date
  const initialStartDate = subDays(initialEndDate, 28); // 4 weeks ago
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [data, setData] = useState([]); // State to hold the fetched data

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  }, [startDate, endDate]);

  const fetchData = async (startDate, endDate) => {
    console.log("Fetching data from:", startDate, "to:", endDate);
    try {
      const fetchedData = await getTransactions(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
      console.log(fetchedData, "transactions data");
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const kpiData = [
    {
      title: "Total Revenue",
      value: "$345,000",
      change: "+12.5%",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Expenses",
      value: "$225,000",
      change: "+8.1%",
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Profit",
      value: "$120,000",
      change: "+15.3%",
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h2 className="text-lg font-semibold">Overview</h2>

      <div className="flex gap-4 w-full">
        {kpiData.map((kpi, index) => (
          <KpiCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            icon={kpi.icon}
          />
        ))}
      </div>
      <DataTable
        title={"Transactions"}
        subtitle={
          "The table captures all cost streams associated with the company"
        }
        columns={columns}
        data={data}
        onDateChange={handleDateChange}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />
    </main>
  );
}
