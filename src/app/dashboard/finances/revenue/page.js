"use client"; // This marks the component as a Client Component

import React, { useState, useEffect } from "react";
import { columns } from "./Columns";
import { useForm, FormProvider } from "react-hook-form";
import DataTable from "@/components/ui/data-table";
import { toast } from "sonner";
import { subDays, format } from "date-fns";
import { getRevenue } from "@/app/api/revenue/getRevenue";
import { createRevenue } from "@/app/api/revenue/createRevenue";
import { getProjects } from "@/app/api/projects/getProjects";
import { formInputs } from "./Inputs";
export default function Revenue() {
  const methods = useForm();
  const initialEndDate = new Date();
  const initialStartDate = subDays(initialEndDate, 28);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [data, setData] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate); // Fetch data on date change
    }
    fetchProjects();
  }, [startDate, endDate]);

  const fetchData = async (startDate, endDate) => {
    console.log("Fetching data from:", startDate, "to:", endDate);
    try {
      const fetchedData = await getRevenue(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
      console.log(fetchedData, "data");
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch revenue data");
    }
  };

  const fetchProjects = async () => {
    try {
      const projects = await getProjects(true);
      setProjectOptions(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
    }
  };

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const onAddRow = async (newRowData) => {
    try {
      await createRevenue(newRowData);
      toast.success("New revenue added");
      fetchData(startDate, endDate); // Refresh the data
    } catch (error) {
      toast.error("Failed to add new revenue");
      console.error("Error adding new revenue:", error);
    }
  };

  const onEditRow = (editedData) => {
    toast.success("Row updated");
    console.log(editedData, "edited data");
    // Implement edit functionality if needed
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <FormProvider {...methods}>
        <DataTable
          title={"Revenue"}
          subtitle={"List of all revenue in the company"}
          columns={columns}
          data={data}
          projectOptions={projectOptions}
          formInputs={formInputs}
          isTableAddFormEnabled={true}
          onAddRow={onAddRow}
          onEditRow={onEditRow}
          filterColumn={"status"}
          onDateChange={handleDateChange}
          initialStartDate={startDate}
          initialEndDate={endDate}
        />
      </FormProvider>
    </main>
  );
}
