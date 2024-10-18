"use client";
import React, { useState, useEffect } from "react";
import DataTable from "@/components/ui/data-table";
import { columns } from "@/app/dashboard/finances/expenses/Columns";
import { toast } from "sonner";
import { formInputs } from "@/app/dashboard/finances/expenses/Inputs";
import { subDays, format } from "date-fns";
import { useForm, FormProvider } from "react-hook-form";
import { getExpense } from "@/app/api/expense/getExpense";
import { createExpense } from "@/app/api/expense/createExpense";
import { getProjects } from "@/app/api/projects/getProjects";
import { editExpense } from "@/app/api/expense/editExpense";

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
    fetchProjects();
  }, [startDate, endDate]);

  const fetchData = async (startDate, endDate) => {
    console.log("Fetching data from:", startDate, "to:", endDate);
    try {
      const fetchedData = await getExpense(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
      console.log(fetchedData, "data");
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const projects = await getProjects(true);
      setProjectOptions(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const onAddRow = async (newRowData) => {
    try {
      await createExpense(newRowData);
      toast.success("New row added");
      // console.log(newRowData, "in form");
    } catch (error) {
      toast.error("Failed to add new row");
      console.error("Error adding new row:", error);
    }
  };

  const onEditRow = async (editedData) => {
    try {
      await editExpense(editedData.id, editedData);
      toast.success("Expense updated successfully");
      // Optionally, you can update the local state here if needed
      setData((prevData) =>
        prevData.map((item) => (item.id === editedData.id ? editedData : item))
      );
    } catch (error) {
      toast.error("Failed to update expense");
      console.error("Error updating expense:", error);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <FormProvider {...methods}>
        <DataTable
          title={"Expenses"}
          subtitle={"List of all expenses in the company"}
          columns={columns}
          data={data}
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
