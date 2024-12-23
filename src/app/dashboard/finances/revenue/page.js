"use client"; // This marks the component as a Client Component

import { createRevenue } from "@/app/api/revenue/createRevenue";
import { deleteRevenue } from "@/app/api/revenue/deleteRevenue";
import { editRevenue } from "@/app/api/revenue/editRevenue";
import { useRevenue } from "@/app/hooks/finances/useRevenue";
import { useProjects } from "@/app/hooks/projects/useProjects";
import { LargeTitleSkeleton, ProjectPageSkeletonCard } from "@/components/Skeletons";
import DataTable from "@/components/ui/data-table";
import { UploadSheetDialog } from "@/components/UploadSheetDialog";
import { useDateRange } from "@/context/dateRangeContext/DateRangeContext";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { columns } from "./Columns";
import { formInputs } from "./Inputs";

export default function Revenue() {
  const methods = useForm();

  const [refreshKey, setRefreshKey] = useState(0);
    const { startDate, endDate, setStartDate, setEndDate } = useDateRange();
  
    const handleDateChange = (newStartDate, newEndDate) => {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    };
    const {data,isLoading:loading}=useRevenue(format(startDate, "yyyy-MM-dd"),format(endDate, "yyyy-MM-dd"))
    const{data:projectOptions}=useProjects(true)

  const refreshComponent = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);


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
