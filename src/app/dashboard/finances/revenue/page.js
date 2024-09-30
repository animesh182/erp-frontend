"use client"; // Ensure this is at the top of the file

import React, { useState, useEffect } from "react";

import { columns } from "./Columns";
import { useForm, FormProvider } from "react-hook-form";

import DataTable from "@/components/ui/data-table";
import { formInputs } from "./Inputs";
import { toast } from "sonner";
import { subDays, format } from "date-fns";
import { useRevenue } from "@/hooks/useRevenue";
import { useAddRevenue } from "@/sevices/useRevenueServices";

export default function Revenue() {
  const methods = useForm();
  // Set initial start and end dates
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
  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };
  // const revenues = [
  //   {
  //     name: "ebibaaha Invoice",
  //     projectName: "ebibaaha",
  //     invoice: "#EBI001",
  //     invoiceIssuedDate: "Jan 12, 2023",
  //     paidDate: "Jan 20, 2023",
  //     status: "paid",
  //     type: "recurring",
  //     amount: 10000,
  //   },
  //   {
  //     name: "Cloud Storage Invoice",
  //     projectName: "Cloud Storage",
  //     invoice: "#CLS002",
  //     invoiceIssuedDate: "Feb 15, 2023",
  //     paidDate: "Feb 28, 2023",
  //     status: "paid",
  //     type: "one-time",
  //     amount: 25000,
  //   },
  //   {
  //     name: "Solar Panels Invoice",
  //     projectName: "Solar Panels",
  //     invoice: "#SOL003",
  //     invoiceIssuedDate: "Mar 3, 2023",
  //     paidDate: "Mar 18, 2023",
  //     status: "paid",
  //     type: "recurring",
  //     amount: 50000,
  //   },
  //   {
  //     name: "Membership Software Invoice",
  //     projectName: "Membership Software",
  //     invoice: "#MEM004",
  //     invoiceIssuedDate: "Apr 1, 2023",
  //     paidDate: null,
  //     status: "pending",
  //     type: "recurring",
  //     amount: 7500,
  //   },
  //   {
  //     name: "Online Course Platform Invoice",
  //     projectName: "Online Course Platform",
  //     invoice: "#OCP005",
  //     invoiceIssuedDate: "May 5, 2023",
  //     paidDate: "May 15, 2023",
  //     status: "paid",
  //     type: "one-time",
  //     amount: 30000,
  //   },
  //   {
  //     name: "Inventory Management System Invoice",
  //     projectName: "Inventory Management System",
  //     invoice: "#IMS006",
  //     invoiceIssuedDate: "Jun 10, 2023",
  //     paidDate: null,
  //     status: "pending",
  //     type: "recurring",
  //     amount: 15000,
  //   },
  //   {
  //     name: "Tracking Software Invoice",
  //     projectName: "Tracking Software",
  //     invoice: "#TRK007",
  //     invoiceIssuedDate: "Jul 7, 2023",
  //     paidDate: "Jul 21, 2023",
  //     status: "paid",
  //     type: "one-time",
  //     amount: 20000,
  //   },
  //   {
  //     name: "Graphic Design Tool Invoice",
  //     projectName: "Graphic Design Tool",
  //     invoice: "#GDT008",
  //     invoiceIssuedDate: "Aug 15, 2023",
  //     paidDate: "Aug 30, 2023",
  //     status: "paid",
  //     type: "recurring",
  //     amount: 12000,
  //   },
  //   {
  //     name: "Patient Management System Invoice",
  //     projectName: "Patient Management System",
  //     invoice: "#PMS009",
  //     invoiceIssuedDate: "Sep 1, 2023",
  //     paidDate: null,
  //     status: "pending",
  //     type: "one-time",
  //     amount: 40000,
  //   },
  //   {
  //     name: "Scheduling App Invoice",
  //     projectName: "Scheduling App",
  //     invoice: "#SCH010",
  //     invoiceIssuedDate: "Oct 10, 2023",
  //     paidDate: "Oct 25, 2023",
  //     status: "paid",
  //     type: "recurring",
  //     amount: 8000,
  //   },
  // ];


  const {mutate}=useAddRevenue();
  // const onAddRow = (newRowData) => {
  //   mutate(newRowData)
  //   toast.success("New row added");
  //   console.log(newRowData, "in form");
  // };

  const onAddRow = (newRowData) => {
    const transformedData = {
      invoice_details: {
        id: newRowData.invoice, 
        name: newRowData.name, 
        amount: newRowData.amount, 
        payment_date: newRowData.paidDate || null, 
        issued_date: newRowData.invoiceIssuedDate, 
        project_name: newRowData.projectName, 
        payment_status: newRowData.status === "paid" ? 2 : newRowData.status === "unpaid" ? 1 : 0,
        payment_type: newRowData.type, 
        client: 1,
        transaction_type: "Revenue", 
      }
    };
  
    // Now mutate with the transformed data
    mutate(transformedData);
    toast.success("New row added");
    console.log(transformedData, "Transformed data to be sent");
  };

  const onEditRow = (editedData) => {
    toast.success("Row updated");
    console.log(editedData, "edited data");
    // Update the data in your state or send it to the server
  };

  const {data:revenues}=useRevenue();


  return (

    <>
    {revenues &&(
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <FormProvider {...methods}>
        <DataTable
          title={"Revenue"}
          subtitle={"List of all revenue in the company"}
          columns={columns}
          data={revenues}
          projectOptions={pjOptions}
          formInputs={formInputs}
          isTableAddFormEnabled={true}
          onAddRow={onAddRow}
          onEditRow={onEditRow} //gets passed through the context in datatable
          filterColumn={"status"}
          onDateChange={handleDateChange}
          initialStartDate={startDate} // Pass initial start date
          initialEndDate={endDate} // Pass initial end date
        />
      </FormProvider>
    </main>)}
    </>
  );
}
