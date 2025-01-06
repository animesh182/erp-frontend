"use client";
import { deletePayroll } from "@/app/api/finances/payroll/deletePayroll";
import { getExcelPayroll } from "@/app/api/finances/payroll/getExcelPayroll";
import { updatePayroll } from "@/app/api/finances/payroll/updatePayroll";
import { columns } from "@/app/dashboard/finances/payroll/Columns";
import { usePayroll } from "@/app/hooks/finances/usePayroll";
import { usePayrollKpi } from "@/app/hooks/kpiData/usePayrollKpi";
import KpiCard from "@/components/kpicard";
import { KpiSkeleton, ProjectPageSkeletonCard } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { UploadSheetDialog } from "@/components/UploadSheetDialog";
import { useDateRange } from "@/context/dateRangeContext/DateRangeContext";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Payroll() {
  const methods = useForm();

    const { startDate, endDate, setStartDate, setEndDate } = useDateRange();


    const{data,isLoading:loading,refetch:refetchPayroll}=usePayroll(  format(startDate, "yyyy-MM-dd"), format(endDate, "yyyy-MM-dd"))
    const{data:kpiValues}=usePayrollKpi()
    const handleDateChange = (newStartDate, newEndDate) => {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    };


  const  handleSheetDownload = async () => {
    try{
      const response = await getExcelPayroll();
    }
    catch{
      console.error("error")
    }
  };

  const onEditRow = async (editedData) => {
    try {
      console.log("Edited data:", editedData);

      const updatedSalary = await updatePayroll(editedData.id, {
        name: editedData.name,
        // description: editedData.name,
        invoice_issued_date: editedData.invoiceIssuedDate,
        payment_date: editedData.paidDate,
        payment_status: editedData.status === "paid" ? "Paid" : "Pending",
        type: editedData.type,
        amount: editedData.amount,
      });
      toast.success("Row updated successfully");
      refetchPayroll()
    } catch (error) {
      toast.error("Failed to update row");
      console.error("Error updating row:", error.message);
    }
  };

  const onDeleteRow = async (id) => {
    try {
      await deletePayroll(id);
      toast.success("Payroll deleted successfully");
      refetchPayroll()
    } catch (error) {
      toast.error("Failed to delete payroll");
      console.error("Error deleting payroll:", error);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex w-full justify-end gap-4">
        <Button size="sm" className="gap-2" onClick={handleSheetDownload}>
          <Download className="h-4 w-4" />
          Get Payroll Sheet
        </Button>
        <UploadSheetDialog onRefresh={refetchPayroll}/>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {kpiValues && kpiValues.length > 0
          ? kpiValues.map((card, index) => (
              <KpiCard
                key={card.title}
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                icon={card.icon}
                isMoney={card.isMoney}
                hasSubText={false}
              />
            ))
          : [...Array(3)].map((_, index) => (
              <div key={index}>
                <KpiSkeleton />
              </div>
            ))}
      </div>

      <FormProvider {...methods}>
        {loading?
                  <ProjectPageSkeletonCard/>
                :
        <DataTable
          title={"Payroll"}
          subtitle="View and manage comprehensive salary details of all employees"
          columns={columns}
          data={data}
          isTableAddFormEnabled={false}
          onEditRow={onEditRow}
          onDeleteRow={onDeleteRow}
          initialStartDate={startDate}
          initialEndDate={endDate}
          onDateChange={handleDateChange}
          loading={loading}
          isMonthPicker={true}
        />
        }
      </FormProvider>
    </main>
  );
}