"use client";
import React, { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/ui/data-table";
import { columns } from "@/app/dashboard/finances/expenses/Columns";
import { toast } from "sonner";
import { formInputs } from "@/app/dashboard/finances/expenses/Inputs";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { useForm, FormProvider } from "react-hook-form";
import { getExpense } from "@/app/api/expense/getExpense";
import { createExpense } from "@/app/api/expense/createExpense";
import { getProjects } from "@/app/api/projects/getProjects";
import { editExpense } from "@/app/api/expense/editExpense";
import { deleteExpense } from "@/app/api/expense/deleteExpense";
import { UploadSheetDialog } from "@/components/UploadSheetDialog";

export default function Expenses() {
  const methods = useForm();
  // Get first day of current month
  const initialStartDate = startOfMonth(new Date());
  // Get last day of current month
  const initialEndDate = endOfMonth(new Date());

  const [startDate, setStartDate] = useState(
    format(initialStartDate, "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(initialEndDate, "yyyy-MM-dd"));
  const [data, setData] = useState([]); // State to hold the fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [projectOptions, setProjectOptions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshComponent = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
    fetchProjects();
  }, [startDate, endDate, refreshKey]);

  const fetchData = async (startDate, endDate) => {
    // console.log("Fetching data from:", startDate, "to:", endDate);
    try {
      const fetchedData = await getExpense(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
      // console.log(fetchedData, "data");
      setData(fetchedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
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
    setEndDate(format(endOfMonth(new Date(endDate)), "yyyy-MM-dd"));
  };

  const onAddRow = async (newRowData) => {
    try {
      await createExpense(newRowData);
      toast.success("New expense added");
      refreshComponent();
    } catch (error) {
      toast.error("Failed to add new expense");
      console.error("Error adding new expense:", error);
    }
  };

  const onEditRow = async (editedData) => {
    try {
      await editExpense(editedData.id, editedData);
      toast.success("Expense updated successfully");
      refreshComponent();
    } catch (error) {
      toast.error("Failed to update expense");
      console.error("Error updating expense:", error);
    }
  };

  const onDeleteRow = async (rowId) => {
    try {
      await deleteExpense(rowId);
      toast.success("Expense deleted successfully");
      refreshComponent();
    } catch (error) {
      toast.error("Failed to delete expense");
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="w-full flex justify-end">
        <UploadSheetDialog className="" isExpense={true} onRefresh={refreshComponent}/>
      </div>
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
          onDeleteRow={onDeleteRow}
          filterColumn={"costType"}
          onDateChange={handleDateChange}
          initialStartDate={startDate}
          initialEndDate={endDate}
          isMonthPicker={true}
          loading={loading}
        />
      </FormProvider>
    </main>
  );
}
