"use client"; // This marks the component as a Client Component

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import DataTable from "@/components/ui/data-table";
import { toast } from "sonner";
import { subDays, format } from "date-fns";
import { columns } from "./Columns";
import { formInputs } from "./Inputs";
import { fetchInvoices } from "@/app/api/invoice";
import { updateInvoice } from "@/app/api/revenue_edit";
import { addInvoice } from "@/app/api/revenue_add";

export default function Revenue() {
  const methods = useForm();
  // Set initial start and end dates
  const initialEndDate = new Date(); // Today's date
  const initialStartDate = subDays(initialEndDate, 28); // 4 weeks ago
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [data, setData] = useState([]); // State to hold the fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [projectOptions, setProjectOptions] = useState(true);

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate); // Fetch data on date change
    }
  }, [startDate, endDate]);

  const fetchData = async (startDate, endDate) => {
    setLoading(true); // Set loading state before fetching data
    try {
      const fetchedData = await fetchInvoices(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );

      // Map the fetched data to match your table column structure
      const mappedData = fetchedData.map((invoice) => ({
        id: invoice.id,
        name: invoice.name,
        projectName: invoice.project_name,
        invoice: `#INV${invoice.id}`, // Generate an invoice number if needed
        invoiceIssuedDate: invoice.issued_date,
        paidDate: invoice.payment_date,
        status: invoice.payment_status === 2 ? "paid" : "pending",
        type: invoice.transaction_type,
        amount: invoice.amount,
        project_id: invoice.project_id,
      }));

      // Extract unique project options from invoices using project_id and project_name
      const projectOptions = Array.from(
        new Map(
          fetchedData.map((invoice) => [
            invoice.project_id,
            {
              id: invoice.project_id,
              name: invoice.project_name,
            },
          ])
        ).values()
      );

      console.log(mappedData, "Invoice data with project mapping");
      console.log(projectOptions, "Dynamically generated project options");

      setData(mappedData);
      setProjectOptions(projectOptions); // Store project options in state
      toast.success("Data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const onAddRow = async (newRowData) => {
    try {
      // Find project_id based on projectName from projectOptions
      const selectedProject = projectOptions.find(
        (project) => project.name === newRowData.projectName
      );

      if (!selectedProject) {
        throw new Error("Project not found or project name is invalid");
      }

      const addedInvoice = await addInvoice({
        name: newRowData.name,
        paidDate: newRowData.paidDate,
        client: 1, // Assuming client ID is hardcoded or dynamic
        amount: newRowData.amount,
        project_id: selectedProject.id, // Use project_id based on projectName
        status: newRowData.status === "paid" ? 2 : 1,
        payment_type: newRowData.payment_type,
      });

      // Update the table data with the newly added invoice
      setData((prevData) => [...prevData, addedInvoice]); // Append the new row to the table data
      toast.success("New row added successfully");
    } catch (error) {
      toast.error("Failed to add new row");
      console.error("Error adding row:", error.message);
    }
  };

  const onEditRow = async (editedData) => {
    try {
      console.log("Edited data before update:", editedData);

      if (!editedData.id) {
        throw new Error("Invoice ID is missing in edited data");
      }

      // Map project name to project_id
      const selectedProject = projectOptions.find(
        (project) => project.name === editedData.projectName
      );

      if (!selectedProject) {
        throw new Error("Project not found or project name is invalid");
      }

      const formattedPaidDate = editedData.paidDate
        ? format(new Date(editedData.paidDate), "yyyy-MM-dd")
        : null;

      const payload = {
        name: editedData.name,
        paidDate: formattedPaidDate,
        client: editedData.client || 1, // Default client
        amount: editedData.amount,
        project_id: selectedProject.id, // Get the project_id
        status: editedData.status === "paid" ? 2 : 1, // Status handling
        type: editedData.type, // Make sure `type` is sent as `one-time` or `recurring`
      };

      console.log("Payload being sent to the API:", payload);

      const updatedInvoice = await updateInvoice(editedData.id, payload);

      setData((prevData) =>
        prevData.map((row) =>
          row.id === updatedInvoice.id ? updatedInvoice : row
        )
      );

      toast.success("Row updated successfully");
    } catch (error) {
      toast.error("Failed to update row");
      console.error("Error updating row:", error.message);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <FormProvider {...methods}>
        <DataTable
          title={"Revenue"}
          subtitle={"List of all revenue in the company"}
          columns={columns}
          data={data} // Use dynamic data here
          projectOptions={projectOptions} // Pass dynamic project options
          formInputs={formInputs}
          isTableAddFormEnabled={true}
          onAddRow={onAddRow}
          onEditRow={onEditRow} // Pass the edit function
          filterColumn={"status"}
          onDateChange={handleDateChange}
          initialStartDate={startDate} // Pass initial start date
          initialEndDate={endDate} // Pass initial end date
          loading={loading} // Pass loading state to the DataTable component if necessary
        />
      </FormProvider>
    </main>
  );
}
