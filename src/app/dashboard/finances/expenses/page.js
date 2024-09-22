"use client";
import React, { useState, useEffect } from "react";

import DataTable from "@/components/ui/data-table";

import { columns } from "@/app/dashboard/finances/expenses/Columns";
import { toast } from "sonner";

import { formInputs } from "@/app/dashboard/finances/expenses/Inputs";
import { subDays, format } from "date-fns";

import { useForm, FormProvider } from "react-hook-form";

export default function Expenses() {
  const methods = useForm();
  const initialEndDate = new Date(); // Today's date
  const initialStartDate = subDays(initialEndDate, 28); // 4 weeks ago
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [data, setData] = useState([]); // State to hold the fetched data
  const [projectOptions, setProjectOptions] = useState([]);

  const pjOptions = [
    { id: "1", name: "ebibaaha" },
    { id: "2", name: "Cloud Storage" },
    { id: "3", name: "Solar Panels" },
    { id: "4", name: "Membership Software" },
    { id: "5", name: "Online Course Platform" },
    { id: "6", name: "Inventory Management System" },
    { id: "7", name: "Tracking Software" },
    { id: "8", name: "Graphic Design Tool" },
    { id: "9", name: "Patient Management System" },
    { id: "10", name: "Scheduling App" },
  ];

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  }, [startDate, endDate]);

  const fetchData = (startDate, endDate) => {
    console.log("Fetching data from:", startDate, "to:", endDate);

    const fetchedData = [
      // Add your data here or fetch from your API
    ];
    setData(fetchedData);
  };

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const expenses = [
    {
      name: "ebibaaha",
      projectName: "ebibaaha",
      invoice: "#123",
      invoiceIssuedDate: "Jan 12, 2021",
      paidDate: "Jan 12, 2021",
      status: "paid",
      type: "recurring",
      amount: 1000,
      costType: "direct-cost",
    },
    {
      name: "TechSolutions Inc.",
      projectName: "Cloud Storage",
      invoice: "#456",
      invoiceIssuedDate: "Feb 15, 2021",
      paidDate: "Feb 20, 2021",
      status: "paid",
      type: "one-time",
      amount: 2500,
      costType: "direct-cost",
    },
    {
      name: "Green Energy Co.",
      projectName: "Solar Panels",
      invoice: "#789",
      invoiceIssuedDate: "Mar 3, 2021",
      paidDate: "Mar 10, 2021",
      status: "paid",
      type: "recurring",
      amount: 5000,
      costType: "direct-cost",
    },
    {
      name: "FixLife Gym",
      projectName: "Membership Software",
      invoice: "#101",
      invoiceIssuedDate: "Apr 1, 2021",
      paidDate: null,
      status: "pending",
      type: "recurring",
      amount: 750,
      costType: "direct-cost",
    },
    {
      name: "EducationLearn Academy",
      projectName: "Online Course Platform",
      invoice: "#202",
      invoiceIssuedDate: "May 5, 2021",
      paidDate: "May 7, 2021",
      status: "paid",
      type: "one-time",
      amount: 3000,
      costType: "fixed-cost",
    },
    {
      name: "FreshFoods Market",
      projectName: "Inventory Management System",
      invoice: "#303",
      invoiceIssuedDate: "Jun 10, 2021",
      paidDate: "Jun 15, 2021",
      status: "paid",
      type: "recurring",
      amount: 1200,
      costType: "npa-cost",
    },
    {
      name: "SwiftShip Logistics",
      projectName: "Tracking Software",
      invoice: "#404",
      invoiceIssuedDate: "Jul 7, 2021",
      paidDate: null,
      status: "pending",
      type: "one-time",
      amount: 4000,
      costType: "direct-cost",
    },
    {
      name: "CreativeCo Design",
      projectName: "Graphic Design Tool",
      invoice: "#505",
      invoiceIssuedDate: "Aug 20, 2021",
      paidDate: "Aug 25, 2021",
      status: "paid",
      type: "recurring",
      amount: 900,
      costType: "npa-cost",
    },
    {
      name: "HealthFirst Clinic",
      projectName: "Patient Management System",
      invoice: "#606",
      invoiceIssuedDate: "Sep 1, 2021",
      paidDate: "Sep 5, 2021",
      status: "paid",
      type: "one-time",
      amount: 6000,
      costType: "direct-cost",
    },
    {
      name: "GreenLeaf Landscaping",
      projectName: "Scheduling App",
      invoice: "#707",
      invoiceIssuedDate: "Oct 12, 2021",
      paidDate: null,
      status: "pending",
      type: "recurring",
      amount: 800,
      costType: "fixed-cost",
    },
  ];
  const onAddRow = (newRowData) => {
    toast.success("New row added");
    console.log(newRowData, "in form");
  };

  const onEditRow = (editedData) => {
    toast.success("Row updated");
    console.log(editedData, "edited data");
    // Update the data in your state or send it to the server
  };
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <FormProvider {...methods}>
        <DataTable
          title={"Expenses"}
          subtitle={"List of all expenses in the company"}
          columns={columns}
          data={expenses}
          projectOptions={pjOptions}
          formInputs={formInputs}
          isTableAddFormEnabled={true}
          onAddRow={onAddRow}
          onEditRow={onEditRow}
          filterColumn={"costType"}
          onDateChange={handleDateChange}
          initialStartDate={startDate} // Pass initial start date
          initialEndDate={endDate} // Pass initial end date
        />
      </FormProvider>
    </main>
  );
}
