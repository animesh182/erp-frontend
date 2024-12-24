"use client";
import { columns } from "@/app/dashboard/finances/expenses/Columns";
import { formInputs } from "@/app/dashboard/finances/expenses/Inputs";
import { useExpense } from "@/app/hooks/finances/useExpense";
import { useProjects } from "@/app/hooks/projects/useProjects";
import { useAddExpense, useDeleteExpense, useEditExpense } from "@/app/services/useExpenseServices";
import { LargeTitleSkeleton, ProjectPageSkeletonCard } from "@/components/Skeletons";
import DataTable from "@/components/ui/data-table";
import { UploadSheetDialog } from "@/components/UploadSheetDialog";
import { useDateRange } from "@/context/dateRangeContext/DateRangeContext";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function Expenses() {
  const methods = useForm();
    const { startDate, endDate, setStartDate, setEndDate } = useDateRange();

    const handleDateChange = (newStartDate, newEndDate) => {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    };
  const [refreshKey, setRefreshKey] = useState(0);

    const{data:projectOptions}=useProjects(true)
    const{data,isLoading:loading}=useExpense(format(startDate, "yyyy-MM-dd"),format(endDate, "yyyy-MM-dd"))
    const{mutate:createExpense}=useAddExpense()
    const{mutate:editExpense}=useEditExpense()
    const{mutate:deleteExpense}=useDeleteExpense()
  const refreshComponent = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);


    const onAddRow = async (newRowData) => {
      createExpense(newRowData,
      { onSuccess: () => {
        refreshComponent()
      }}
      )
    };

  const onEditRow = async (editedData) => {

    const expenseId=editedData?.id
    editExpense({
      expenseId,
      expenseData: editedData, 
    },
    { onSuccess: () => {
      refreshComponent()
      }});
  };

  const onDeleteRow = async (rowId) => {
    deleteExpense({expenseId:rowId},
      { onSuccess: () => {
        refreshComponent()
        }}
    )
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="w-full flex justify-end">
        <UploadSheetDialog className="" isExpense={true} onRefresh={refreshComponent}/>
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
