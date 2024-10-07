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

export default function Payroll() {
  const methods = useForm();
  const initialEndDate = new Date(); // Today's date
  const initialStartDate = subDays(initialEndDate, 28); // 4 weeks ago
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [data, setData] = useState([]); // State to hold the fetched data
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  }, [startDate, endDate]);

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
        name: item.description,
        projectName: null, // If no projectName is available
        invoice: `#${item.id}`,
        invoiceIssuedDate: item.invoice_issued_date,
        paidDate: item.payment_date,
        status: item.payment_status.toLowerCase(), // Assuming it's "Paid" or "Pending"
        type: item.type.toLowerCase(), // Ensure type is properly formatted
        amount: parseFloat(item.amount), // Convert amount to a number
      }));

      setData(mappedData); // Store the fetched data in state
      console.log(mappedData, "date");
      toast.success("Data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  };

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

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
    console.log("Downloading payroll sheet");
  };

  const onEditRow = async (editedData) => {
    try {
      console.log("Edited data:", editedData); // Log the edited data

      // Send the edited data to the server
      const updatedSalary = await updateSalary(editedData.id, {
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
      <div className="flex gap-4 md:gap-6 lg:gap-6">
        {kpivalues.map((card) => (
          <KpiCard
            key={card.title}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
          />
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
          loading={loading} // Pass loading state to the DataTable component if necessary
        />
      </FormProvider>
    </main>
  );
}
