"use client";
import React, { useState, useEffect } from "react";

import { columns } from "./Columns";
import DataTable from "@/components/ui/data-table";
import KpiCard from "@/components/kpicard";
import { Activity, CreditCard, DollarSign } from "lucide-react";
import { subDays, format } from "date-fns";
import { useTheme } from "next-themes";
export default function Transactions() {
  const { theme } = useTheme();

  console.log(theme);
  const initialEndDate = new Date(); // Today's date
  const initialStartDate = subDays(initialEndDate, 28); // 4 weeks ago
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [data, setData] = useState([]); // State to hold the fetched data

  const fetchData = (startDate, endDate) => {
    console.log("Fetching data from:", startDate, "to:", endDate);

    // Replace this with your actual data fetching logic
    // For example, you could fetch data from an API and update the state:
    // fetch(`/api/revenues?start=${startDate}&end=${endDate}`)
    //   .then(response => response.json())
    //   .then(fetchedData => setData(fetchedData));

    // Mocked data fetch for demonstration
    const fetchedData = [
      // Add your data here or fetch from your API
    ];
    setData(fetchedData);
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  }, [startDate, endDate]);
  const transactions = [
    {
      name: "Software Development Project",
      projectName: "CRM System",
      invoice: "#INV001",
      invoiceIssuedDate: "Jan 15, 2023",
      status: "paid",
      paidDate: "Jan 30, 2023",
      type: "one-time",
      amount: 50000,
      costType: "expense",
    },
    {
      name: "Website Redesign",
      projectName: "E-commerce Platform",
      invoice: "#INV002",
      invoiceIssuedDate: "Feb 1, 2023",
      status: "pending",
      paidDate: null,
      type: "recurring",
      amount: 15000,
      costType: "revenue",
    },
    {
      name: "Mobile App Development",
      projectName: "Fitness Tracker",
      invoice: "#INV003",
      invoiceIssuedDate: "Mar 10, 2023",
      status: "paid",
      paidDate: "Mar 25, 2023",
      type: "one-time",
      amount: 75000,
      costType: "expense",
    },
    {
      name: "Cloud Migration Services",
      projectName: "Data Center Upgrade",
      invoice: "#INV004",
      invoiceIssuedDate: "Apr 5, 2023",
      status: "paid",
      paidDate: "Apr 20, 2023",
      type: "one-time",
      amount: 100000,
      costType: "revenue",
    },
    {
      name: "UI/UX Consultation",
      projectName: "Dashboard Redesign",
      invoice: "#INV005",
      invoiceIssuedDate: "May 12, 2023",
      status: "pending",
      paidDate: null,
      type: "recurring",
      amount: 10000,
      costType: "revenue",
    },
    {
      name: "Security Audit",
      projectName: "Financial System",
      invoice: "#INV006",
      invoiceIssuedDate: "Jun 1, 2023",
      status: "paid",
      paidDate: "Jun 15, 2023",
      type: "one-time",
      amount: 30000,
      costType: "revenue",
    },
    {
      name: "API Integration",
      projectName: "Payment Gateway",
      invoice: "#INV007",
      invoiceIssuedDate: "Jul 8, 2023",
      status: "paid",
      paidDate: "Jul 23, 2023",
      type: "recurring",
      amount: 25000,
      costType: "expense",
    },
    {
      name: "Performance Optimization",
      projectName: "E-learning Platform",
      invoice: "#INV008",
      invoiceIssuedDate: "Aug 20, 2023",
      status: "pending",
      paidDate: null,
      type: "one-time",
      amount: 40000,
      costType: "revenue",
    },
  ];

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
        data={transactions}
        onDateChange={handleDateChange}
        initialStartDate={startDate}
        initialEndDate={endDate}
        theme={theme}
      />
    </main>
  );
}
