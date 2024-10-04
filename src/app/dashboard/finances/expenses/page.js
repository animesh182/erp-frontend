"use client";
import React, { useState, useEffect } from "react";
import DataTable from "@/components/ui/data-table";
import { columns } from "@/app/dashboard/finances/expenses/Columns";
import { toast } from "sonner";
import { formInputs } from "@/app/dashboard/finances/expenses/Inputs";
import { subDays, format } from "date-fns";
import { useForm, FormProvider } from "react-hook-form";
import { fetchExpenses } from "@/app/api/expenses"; // Import the fetch function

export default function Expenses() {
  const methods = useForm();
  const initialEndDate = new Date(); // Today's date
  const initialStartDate = subDays(initialEndDate, 28); // 4 weeks ago
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [data, setData] = useState([]); // State to hold the fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [projectOptions, setProjectOptions] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  }, [startDate, endDate]);

  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    try {
      // Fetch data from the invoices API
      const fetchedData = await fetchExpenses(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );

      // Map the fetched data to match your table column structure
      const mappedData = fetchedData.map((invoice) => ({
        id: invoice.id,
        name: invoice.name, // Assuming "name" field corresponds to the expense name
        projectName: invoice.project_name,
        invoice: `#${invoice.id}`, // Generate an invoice number if needed
        invoiceIssuedDate: invoice.issued_date,
        paidDate: invoice.payment_date,
        status: invoice.payment_status === 2 ? "paid" : "pending", // Assuming payment_status 2 is 'paid'
        type: invoice.transaction_type, // Assuming this is either 'Revenue' or 'Expense'
        amount: invoice.amount,
        costType: "", // Leaving costType empty for now
      }));

      console.log(mappedData, "Invoice data with project mapping");

      setData(mappedData); // Store the fetched data in state
      toast.success("Data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  };

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

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
          data={data} // Use dynamic data here
          projectOptions={projectOptions}
          formInputs={formInputs}
          isTableAddFormEnabled={true}
          onAddRow={onAddRow}
          onEditRow={onEditRow}
          filterColumn={"costType"}
          onDateChange={handleDateChange}
          initialStartDate={startDate} // Pass initial start date
          initialEndDate={endDate} // Pass initial end date
          loading={loading} // Pass loading state to the DataTable component if necessary
        />
      </FormProvider>
    </main>
  );
}
