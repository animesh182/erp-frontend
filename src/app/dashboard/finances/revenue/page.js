"use client"; // This marks the component as a Client Component

import React, { useState, useEffect, useCallback } from "react";
import { columns } from "./Columns";
import { useForm, FormProvider } from "react-hook-form";
import DataTable from "@/components/ui/data-table";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { getRevenue } from "@/app/api/revenue/getRevenue";
import { createRevenue } from "@/app/api/revenue/createRevenue";
import { getProjects } from "@/app/api/projects/getProjects";
import { formInputs } from "./Inputs";
import { editRevenue } from "@/app/api/revenue/editRevenue";
import { deleteRevenue } from "@/app/api/revenue/deleteRevenue";
import { UploadSheetDialog } from "@/components/UploadSheetDialog";
import { useDateRange } from "@/context/dateRangeContext/DateRangeContext";
import { LargeTitleSkeleton, ProjectPageSkeletonCard } from "@/components/Skeletons";

export default function Revenue() {
  const methods = useForm();
  // Get first day of current month
  // const initialStartDate = startOfMonth(new Date());
  // // Get last day of current month
  // const initialEndDate = endOfMonth(new Date());

  // const [startDate, setStartDate] = useState(
  //   format(initialStartDate, "yyyy-MM-dd")
  // );
  // const [endDate, setEndDate] = useState(format(initialEndDate, "yyyy-MM-dd"));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectOptions, setProjectOptions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
    const { startDate, endDate, setStartDate, setEndDate } = useDateRange();
  
    const handleDateChange = (newStartDate, newEndDate) => {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    };

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
    try {
      const fetchedData = await getRevenue(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
      setData(fetchedData);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch revenue data");
      // setLoading(false);
    } finally{
      setLoading(false)
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

  // const handleDateChange = (startDate, endDate) => {
  //   setStartDate(startDate);
  //   setEndDate(format(endOfMonth(new Date(endDate)), "yyyy-MM-dd"));
  // };

  const onAddRow = async (newRowData) => {
    try {
      await createRevenue(newRowData);
      toast.success("New revenue added");
      refreshComponent();
    } catch (error) {
      toast.error("Failed to add new revenue");
      console.error("Error adding new revenue:", error);
    }
  };

  const onEditRow = async (editedData) => {
    try {
      await editRevenue(editedData.id, editedData);
      toast.success("Revenue updated successfully");
      refreshComponent();
    } catch (error) {
      console.error("Error updating revenue:", error);
      toast.error("Failed to update revenue");
    }
  };

  const onDeleteRow = async (rowId) => {
    try {
      await deleteRevenue(rowId);
      toast.success("Revenue deleted successfully");
      refreshComponent();
    } catch (error) {
      console.error("Error deleting revenue:", error);
      toast.error("Failed to delete revenue");
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
         <div className="w-full flex justify-end">
        <UploadSheetDialog className="" isRevenue={true} onRefresh={refreshComponent}/>
      </div>
      <FormProvider {...methods}>
        {loading?
        <div className="space-y-4"> 
          <LargeTitleSkeleton/>
          <ProjectPageSkeletonCard/>
          </div>
        :
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
          onDeleteRow={onDeleteRow}
          filterColumn={"status"}
          onDateChange={handleDateChange}
          initialStartDate={startDate}
          initialEndDate={endDate}
          isMonthPicker={true}
          loading={loading}
        />
}
      </FormProvider>
    </main>
  );
}
