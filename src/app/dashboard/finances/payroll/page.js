"use client";
import React, { useState, useEffect } from "react";
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
import { fetchPayroll } from "@/app/api/payroll"; // Import the fetchSalaries function
import { updatePayroll } from "@/app/api/update_payroll"; // Import the updateSalary function
import { getPayrollKpi } from "@/app/api/finances/payroll/getPayrollKpi";
import * as XLSX from "xlsx";
import { KpiSkeleton } from "@/components/Skeletons";

export default function Payroll() {
  const methods = useForm();
  const initialEndDate = new Date(); // Today's date
  const initialStartDate = subDays(initialEndDate, 28); // 4 weeks ago
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [data, setData] = useState([]); // State to hold the fetched data
  const [loading, setLoading] = useState(true); // Add a loading state
  const [kpiValues, setKpiValues] = useState(null); // State to hold KPI data

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchKpiData();
  }, []);
  const fetchData = async (startDate, endDate) => {
    setLoading(true); // Set loading state before fetching data
    try {
      // Fetch data using the fetchSalaries function
      const fetchedData = await fetchPayroll(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );

      // Map the fetched data to match your table structure
      const mappedData = fetchedData.map((item) => ({
        name: item.name,
        projectName: null, // If no projectName is available
        invoice: `#${item.id}`,
        invoiceIssuedDate: item.invoice_issued_date,
        paidDate: item.payment_date,
        status: item.payment_status.toLowerCase(), // Assuming it's "Paid" or "Pending"
        type: item.type.toLowerCase(), // Ensure type is properly formatted
        amount: parseFloat(item.amount), // Convert amount to a number
      }));

      setData(mappedData); // Store the fetched data in state
      toast.success("Data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  };
  const fetchKpiData = async () => {
    try {
      const response = await getPayrollKpi(); // Call the KPI API function
      if (response.status === 200) {
        const { total_outstanding, upcoming_payroll, previous_payroll } =
          response.data;

        // Map the API response to the KPI card data
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

        setKpiValues(updatedKpiValues); // Update the state with KPI values
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
  console.log(kpiValues, "kpikpikpi");

  const kpivalues = [
    {
      title: "Total Outstanding",
      value: formatAmountToNOK(5000),
      subtitle: "Total outstanding invoices",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: "Upcoming Payment",
      value: "Aug 1, 2024",
      subtitle: "Next payment due",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      title: "Previous Payroll",
      value: formatAmountToNOK(2500),
      subtitle: "Last payroll amount",
      icon: <DollarSign className="h-4 w-4" />,
    },
  ];

  const handleSheetDownload = () => {
    // Prepare the data for Excel
    const worksheetData = data.map((item) => ({
      Name: item.name || "No Name",
      "Project Name": item.projectName || "No Project",
      Invoice: item.invoice,
      "Invoice Issued Date": item.invoiceIssuedDate,
      "Paid Date": item.paidDate || "Not Paid",
      Status: item.status,
      Type: item.type,
      Amount: item.amount,
    }));

    // Create a new worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "payroll_sheet.xlsx");
  };

  const onEditRow = async (editedData) => {
    try {
      console.log("Edited data:", editedData); // Log the edited data

      // Send the edited data to the server
      const updatedSalary = await updatePayroll(editedData.id, {
        description: editedData.name,
        invoice_issued_date: editedData.invoiceIssuedDate,
        payment_date: editedData.paidDate,
        payment_status: editedData.status === "paid" ? "Paid" : "Pending",
        type: editedData.type, // Ensure type is sent correctly
        amount: editedData.amount,
      });

      // Update the table state with the updated salary data
      setData((prevData) =>
        prevData.map((row) =>
          row.id === updatedSalary.id ? updatedSalary : row
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
          : // Render skeletons when kpiValues is empty or undefined
            [...Array(3)].map((_, index) => (
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
          data={data} // Use dynamic data here
          isTableAddFormEnabled={false}
          onEditRow={onEditRow}
          initialStartDate={startDate}
          initialEndDate={endDate}
          onDateChange={handleDateChange}
        />
      </FormProvider>
    </main>
  );
}
