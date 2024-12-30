"use client";
import { createExpense } from "@/app/api/expense/createExpense";
import { deleteExpense } from "@/app/api/expense/deleteExpense";
import { editExpense } from "@/app/api/expense/editExpense";
import { columns } from "@/app/dashboard/finances/expenses/Columns";
import { formInputs } from "@/app/dashboard/finances/expenses/Inputs";
import { useExpense } from "@/app/hooks/finances/useExpense";
import { useProjects } from "@/app/hooks/projects/useProjects";
import { LargeTitleSkeleton, ProjectPageSkeletonCard } from "@/components/Skeletons";
import DataTable from "@/components/ui/data-table";
import { UploadSheetDialog } from "@/components/UploadSheetDialog";
import { useDateRange } from "@/context/dateRangeContext/DateRangeContext";
import { format } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Expenses() {
  const methods = useForm();
    const { startDate, endDate, setStartDate, setEndDate } = useDateRange();
  
    const handleDateChange = (newStartDate, newEndDate) => {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    };

    const{data:projectOptions}=useProjects(true)
    const{data,isLoading:loading,refetch:refetchExpense}=useExpense(format(startDate, "yyyy-MM-dd"),format(endDate, "yyyy-MM-dd"))

  const onAddRow = async (newRowData) => {
    try {
      await createExpense(newRowData);
      toast.success("New expense added");
      refetchExpense()
    } catch (error) {
      toast.error("Failed to add new expense");
      console.error("Error adding new expense:", error);
    }
  };

  const onEditRow = async (editedData) => {
    try {
      await editExpense(editedData.id, editedData);
      toast.success("Expense updated successfully");
      refetchExpense()
    } catch (error) {
      toast.error("Failed to update expense");
      console.error("Error updating expense:", error);
    }
  };

  const onDeleteRow = async (rowId) => {
    try {
      await deleteExpense(rowId);
      toast.success("Expense deleted successfully");
      refetchExpense()
    } catch (error) {
      toast.error("Failed to delete expense");
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="w-full flex justify-end">
        <UploadSheetDialog className="" isExpense={true} onRefresh={refetchExpense}/>
      </div>
      <FormProvider {...methods}>
        {loading?
                <div className="space-y-4"> 
                  <LargeTitleSkeleton/>
                  <ProjectPageSkeletonCard/>
                  </div>
                :
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
        }
      </FormProvider>
    </main>
  );
}
