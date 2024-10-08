"use client";

import React, { useState, useEffect } from "react";

import { columns } from "./Columns";
import { useForm, FormProvider } from "react-hook-form";

import DataTable from "@/components/ui/data-table";
import { formInputs } from "./Inputs";
import { toast } from "sonner";
import { subDays, format } from "date-fns";
import { useRevenue } from "@/hooks/useRevenue";
import { useAddRevenue, useDeleteRevenue, useUpdateRevenue } from "@/sevices/useRevenueServices";
import { formatDateApiFormat } from "@/lib/utils";

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

  const { mutate:editRevenue } = useUpdateRevenue();




  const { mutate: deleteRevenue } = useDeleteRevenue();
  // const onAddRow = (newRowData) => {
  //   mutate(newRowData)
  //   toast.success("New row added");
  //   console.log(newRowData, "in form");
  // };

  const onAddRow = (newRowData) => {
    // const transformedData = {
    //   invoice_details: {
    //     id: newRowData.invoice, 
    //     name: newRowData.name, 
    //     amount: newRowData.amount, 
    //     payment_date: newRowData.paidDate || null, 
    //     issued_date: newRowData.invoiceIssuedDate, 
    //     project_name: newRowData.projectName, 
    //     payment_status: newRowData.status === "paid" ? 2 : newRowData.status === "unpaid" ? 1 : 0,
    //     payment_type: newRowData.type, 
    //     client: 1,
    //     transaction_type: "Revenue", 
    //   }
    // };
  
    // // Now mutate with the transformed data
    // mutate(transformedData);
    toast.success("New row added");
    console.log(transformedData, "Transformed data to be sent");
  };

  const onEditRow = (editedData) => {
   

    const transformedData = {
    
        id: editedData.invoice.replace(/^#/, ''), 
        name: editedData.name, 
        amount: editedData.amount, 
        payment_date: formatDateApiFormat(editedData.paidDate)  || null, 
        issued_date: formatDateApiFormat(editedData.invoiceIssuedDate), 
        project_name: editedData.projectName, 
        payment_status: editedData.status === "paid" ? 2 : editedData.status === "pending" ? 1 : 3,
        payment_type: editedData.type === "One-Time" || editedData.type === "one-time" ? 1 : 2,
   
      
    };

    editRevenue(transformedData);
    toast.success("Row updated");
    // Update the data in your state or send it to the server
  };

  const {data:revenues,isLoading:isRevenueLoading,isError:isRevenueError,error:revenueError}=useRevenue();
  if(isRevenueLoading) return <p>laoding...</p>
  if(isRevenueError) return <p>{revenueError}</p>


  return (

    <>
    {revenues &&(
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <FormProvider {...methods}>
        <DataTable
          title={"Revenue"}
          subtitle={"List of all revenue in the company"}
          columns={columns(deleteRevenue)}
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
