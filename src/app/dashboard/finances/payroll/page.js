"use client";
import React, { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/ui/data-table";
import { CreditCard, DollarSign, Download } from "lucide-react";
import { columns } from "@/app/dashboard/finances/payroll/Columns";
import { formatAmountToNOK } from "@/lib/utils";
import KpiCard from "@/components/kpicard";
import { toast } from "sonner";
import { subDays, format } from "date-fns";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { UploadSheetDialog } from "@/components/UploadSheetDialog";
import { fetchPayroll } from "@/app/api/payroll";
import { updatePayroll } from "@/app/api/update_payroll";
import { getPayrollKpi } from "@/app/api/finances/payroll/getPayrollKpi";
import { getExcelPayroll } from "@/app/api/finances/payroll/getExcelPayroll";

import * as XLSX from "xlsx";
import { KpiSkeleton } from "@/components/Skeletons";
import { deletePayroll } from "@/app/api/finances/payroll/deletePayroll";

export default function Payroll() {
  const methods = useForm();
  const initialEndDate = new Date();
  const initialStartDate = subDays(initialEndDate, 28);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kpiValues, setKpiValues] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshComponent = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
    fetchKpiData();
  }, [startDate, endDate, refreshKey]);

  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    try {
      const fetchedData = await fetchPayroll(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );

      const mappedData = fetchedData.map((item) => ({
        id: item.id,
        name: item.name,
        projectName: null,
        invoice: `#${item.id}`,
        invoiceIssuedDate: item.invoice_issued_date,
        paidDate: item.payment_date,
        status: item.payment_status.toLowerCase(),
        type: item.type.toLowerCase(),
        amount: parseFloat(item.amount),
      }));

      setData(mappedData);
      toast.success("Data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKpiData = async () => {
    try {
      const response = await getPayrollKpi();
      if (response.status === 200) {
        const { total_outstanding, upcoming_payroll, previous_payroll } =
          response.data;

        const updatedKpiValues = [
          {
            title: "Total Outstanding",
            value: total_outstanding,
            subtitle: "Total outstanding invoices",
            icon: <DollarSign className="h-4 w-4" />,
            isMoney: true,
          },
          {
            title: "Upcoming Payroll",
            value: upcoming_payroll.earliest_date
              ? format(new Date(upcoming_payroll.earliest_date), "MMM d, yyyy")
              : "No Upcoming Payroll",
            subtitle: "Next payroll due",
            icon: <CreditCard className="h-4 w-4" />,
            isMoney: false,
          },
          {
            title: "Previous Payroll",
            value: previous_payroll.total_amount
              ? previous_payroll.total_amount
              : "No Previous Payroll",
            subtitle: previous_payroll.most_recent_date
              ? `Paid on ${format(
                  new Date(previous_payroll.most_recent_date),
                  "MMM d, yyyy"
                )}`
              : "No Previous Date",
            icon: <DollarSign className="h-4 w-4" />,
            isMoney: false,
          },
        ];

        setKpiValues(updatedKpiValues);
      } else {
        toast.error("Failed to fetch KPI data");
        console.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch KPI data");
      console.error("Error fetching KPI data:", error);
    }
  };

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const  handleSheetDownload = async () => {
    console.log('bhutro')
    try{
      const response = await getExcelPayroll();
    }
    catch{

    }
  };

  const onEditRow = async (editedData) => {
    try {
      console.log("Edited data:", editedData);

      const updatedSalary = await updatePayroll(editedData.id, {
        description: editedData.name,
        invoice_issued_date: editedData.invoiceIssuedDate,
        payment_date: editedData.paidDate,
        payment_status: editedData.status === "paid" ? "Paid" : "Pending",
        type: editedData.type,
        amount: editedData.amount,
      });

      setData((prevData) =>
        prevData.map((row) =>
          row.id === updatedSalary.id ? updatedSalary : row
        )
      );

      toast.success("Row updated successfully");
      refreshComponent();
    } catch (error) {
      toast.error("Failed to update row");
      console.error("Error updating row:", error.message);
    }
  };

  const onDeleteRow = async (id) => {
    try {
      await deletePayroll(id);
      toast.success("Payroll deleted successfully");
      refreshComponent();
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
        <UploadSheetDialog />
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
        />
      </FormProvider>
    </main>
  );
}
