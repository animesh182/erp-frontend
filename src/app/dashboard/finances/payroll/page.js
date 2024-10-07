"use client";
import React, { useState, useEffect } from "react";
import DataTable from "@/components/ui/data-table";
import { CreditCard, DollarSign, Download } from "lucide-react";
import { columns } from "@/app/dashboard/finances/payroll/Columns";
import {  formatDateApiFormat } from "@/lib/utils";
import KpiCard from "@/components/kpicard";
import { toast } from "sonner";
import { subDays, format } from "date-fns";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { UploadSheetDialog } from "@/components/UploadSheetDialog";
import { usePayroll } from "@/hooks/usePayroll";
import {  getPayrollGenerate } from "@/app/api/payroll/getPayroll";
import { usePayrollKpi } from "@/hooks/usePayrollKpi";
import { useUpdatePayroll } from "@/sevices/usePayrollServices";

export default function Payroll() {
  const methods = useForm();
  const initialEndDate = new Date(); // Today's date
  const initialStartDate = subDays(initialEndDate, 28); // 4 weeks ago
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [data, setData] = useState([]); // State to hold the fetched data
  const [projectOptions, setProjectOptions] = useState([]);

  const pjOptions = [
    { id: "1", name: "ebibaaha" },
    { id: "2", name: "Cloud Storage" },
    { id: "3", name: "Solar Panels" },
    { id: "4", name: "Membership Software" },
    { id: "5", name: "Online Course Platform" },
    { id: "6", name: "Inventory Management System" },
    { id: "7", name: "Tracking Software" },
    { id: "8", name: "Graphic Design Tool" },
    { id: "9", name: "Patient Management System" },
    { id: "10", name: "Scheduling App" },
  ];

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  }, [startDate, endDate]);

  const fetchData = (startDate, endDate) => {
    console.log("Fetching data from:", startDate, "to:", endDate);

    // Replace this with your actual data fetching logic
    // For example, you could fetch data from an API and update the state:
    // fetch(`/api/revenues?start=${startDate}&end=${endDate}`)
    //   .then(response => response.json())
    //   .then(fetchedData => setData(fetchedData));

    // Mocked data fetch for demonstration
    const fetchedData = [
      // Add your data here or fetch from your API
    ];
    setData(fetchedData);
  };

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  // const payroll = [
  //   {
  //     name: "Noah Salary June",
  //     projectName: null,
  //     invoice: "#3066",
  //     invoiceIssuedDate: "Jan 6, 2024",
  //     paidDate: "Jan 6, 2024",
  //     status: "paid",
  //     type: "salary",
  //     amount: 31600,
  //   },
  //   {
  //     name: "Olivia Salary June",
  //     projectName: null,
  //     invoice: "#3067",
  //     invoiceIssuedDate: "Mar 12, 2024",
  //     paidDate: null,
  //     status: "pending",
  //     type: "salary",
  //     amount: 24200,
  //   },
  //   {
  //     name: "Smith Salary June",
  //     projectName: null,
  //     invoice: "#3068",
  //     invoiceIssuedDate: "Jun 8, 2024",
  //     paidDate: null,
  //     status: "pending",
  //     type: "freelance",
  //     amount: 83700,
  //   },
  //   {
  //     name: "Emma Salary June",
  //     projectName: null,
  //     invoice: "#3068",
  //     invoiceIssuedDate: "Jun 27, 2024",
  //     paidDate: "Jun 27, 2024",
  //     status: "paid",
  //     type: "overtime",
  //     amount: 87400,
  //   },
  //   {
  //     name: "Liam Salary June",
  //     projectName: null,
  //     invoice: "#3069",
  //     invoiceIssuedDate: "Jul 1, 2024",
  //     paidDate: "Jul 1, 2024",
  //     status: "paid",
  //     type: "overtime",
  //     amount: 72100,
  //   },
  //   {
  //     name: "Noah Salary June",
  //     projectName: null,
  //     invoice: "#3068",
  //     invoiceIssuedDate: "Jun 8, 2024",
  //     paidDate: null,
  //     status: "pending",
  //     type: "freelance",
  //     amount: 83700,
  //   },
  //   {
  //     name: "Krystal Salary June",
  //     projectName: null,
  //     invoice: "#3068",
  //     invoiceIssuedDate: "Jun 27, 2024",
  //     paidDate: "Jun 27, 2024",
  //     status: "paid",
  //     type: "salary",
  //     amount: 87400,
  //   },
  // ];

  // const kpivalues = [
  //   {
  //     title: "Total Outstanding",
  //     value: formatAmountToNOK(5000),
  //     subtitle: "Total outstanding invoices",
  //     icon: <DollarSign className="h-4 w-4" />,
  //   },
  //   {
  //     title: "Upcoming Payment",
  //     value: "Aug 1, 2024",
  //     subtitle: "Next payment due",
  //     icon: <CreditCard className="h-4 w-4" />,
  //   },
  //   {
  //     title: "Previous Payroll",
  //     value: formatAmountToNOK(2500),
  //     subtitle: "Last payroll amount",
  //     icon: <DollarSign className="h-4 w-4" />,
  //   },
  // ];

  const handleSheetDownload = async () => {
    console.log("Downloading payroll sheet");
  
    try {
      const payrollBlob = await getPayrollGenerate(); 
      const url = window.URL.createObjectURL(payrollBlob); 
  
    
      const a = document.createElement('a');
      a.href = url;
      a.download = 'payroll.xls'; 
      document.body.appendChild(a);
      a.click(); 
      a.remove(); 
  
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error downloading payroll:", error);
    }
  };


  const{mutate:editPayroll}=useUpdatePayroll()

  const onEditRow = (editedData) => {




    const transformedData = {
    
      id: editedData.invoice.replace(/^#/, ''), 
      invoice_issued_date:formatDateApiFormat(editedData.invoiceIssuedDate),
      payment_status:editedData.status,
      payment_date: formatDateApiFormat(editedData.paidDate)  || null, 
      type:editedData.type,
      amount: editedData.amount, 
      

 
    
  };

  editPayroll(transformedData);

    toast.success("Row updated");
    console.log(editedData, "edited data");
    // Update the data in your state or send it to the server
  };


  const{data:kpivalues,isError:isKpiError,isLoading:isKpiLoading,error:kpiError}=usePayrollKpi();

    const{data:payroll,isError:isPayrollError,isLoading:isPayrollLoading,error:payrollError}=usePayroll()


    if(isKpiLoading || isPayrollLoading) return <p>loading.....</p>

    if(isKpiError) return <p>{kpiError}</p>
    if(isPayrollError) return <p>{payrollError}</p>




  return (
    <>
    {payroll && kpivalues && (
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
          data={payroll}
          isTableAddFormEnabled={false}
          onEditRow={onEditRow}
          initialStartDate={startDate}
          initialEndDate={endDate}
          projectOptions={pjOptions}
          onDateChange={handleDateChange}
        />
      </FormProvider>
    </main>
    )}</>
  );
}
