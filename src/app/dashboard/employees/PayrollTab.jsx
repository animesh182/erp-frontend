import React from "react";
import SimpleDataTable from "@/components/ui/simple-data-table";
import { formatAmountToNOK } from "@/lib/utils";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

const PayrollTab = ({ payrollData }) => {
  // If payrollData is not provided, use this default data
  const defaultPayrollData = [
    {
      name: "John Doe",
      paymentDate: "2023-05-01",
      paymentType: "Direct Deposit",
      salary: 5000,
    },
    {
      name: "Jane Smith",
      paymentDate: "2023-05-31",
      paymentType: "Check",
      salary: 5500,
    },
    {
      name: "Bob Johnson",
      paymentDate: "2023-05-01",
      paymentType: "Direct Deposit",
      salary: 4800,
    },
    {
      name: "Alice Brown",
      paymentDate: "2023-05-01",
      paymentType: "Direct Deposit",
      salary: 6000,
    },
    {
      name: "Charlie Davis",
      paymentDate: "2023-05-01",
      paymentType: "Check",
      salary: 5200,
    },
    {
      name: "Eva Wilson",
      paymentDate: "2023-05-15",
      paymentType: "Direct Deposit",
      salary: 5300,
    },
    {
      name: "Frank Miller",
      paymentDate: "2023-05-15",
      paymentType: "Direct Deposit",
      salary: 4900,
    },
    {
      name: "Grace Lee",
      paymentDate: "2023-05-15",
      paymentType: "Check",
      salary: 5700,
    },
    {
      name: "Henry Taylor",
      paymentDate: "2023-05-15",
      paymentType: "Direct Deposit",
      salary: 5100,
    },
    {
      name: "Ivy Clark",
      paymentDate: "2023-05-15",
      paymentType: "Direct Deposit",
      salary: 5400,
    },
    {
      name: "Jack Robinson",
      paymentDate: "2023-05-31",
      paymentType: "Check",
      salary: 5800,
    },
    {
      name: "Karen White",
      paymentDate: "2023-05-31",
      paymentType: "Direct Deposit",
      salary: 5250,
    },
    {
      name: "Liam Harris",
      paymentDate: "2023-05-31",
      paymentType: "Direct Deposit",
      salary: 4950,
    },
    {
      name: "Mia Turner",
      paymentDate: "2023-05-31",
      paymentType: "Check",
      salary: 5600,
    },
    {
      name: "Noah Martinez",
      paymentDate: "2023-05-31",
      paymentType: "Direct Deposit",
      salary: 5150,
    },
    // Additional dummy data
    {
      name: "Olivia Johnson",
      paymentDate: "2023-06-15",
      paymentType: "Direct Deposit",
      salary: 5350,
    },
    {
      name: "Peter Brown",
      paymentDate: "2023-06-15",
      paymentType: "Check",
      salary: 5450,
    },
    {
      name: "Quinn Davis",
      paymentDate: "2023-06-15",
      paymentType: "Direct Deposit",
      salary: 5050,
    },
    {
      name: "Rachel Wilson",
      paymentDate: "2023-06-30",
      paymentType: "Direct Deposit",
      salary: 5550,
    },
    {
      name: "Samuel Miller",
      paymentDate: "2023-06-30",
      paymentType: "Check",
      salary: 5750,
    },
  ];

  const data = payrollData || defaultPayrollData;

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "paymentDate",
      header: "Payment Date",
      cell: ({ row }) =>
        format(new Date(row.original.paymentDate), "MMM d, yyyy"),
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => formatAmountToNOK(row.original.salary),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <h4 className="text-xl font-bold">Payroll</h4>
      <div className="flex flex-col">
        <div className="flex flex-row rounded-md px-6 py-4 w-full justify-between border">
          <div className="flex flex-col w-1/2">
            <span className="text-sm text-muted-foreground">
              Total Payslips
            </span>
            <span className="text-lg font-semibold">18</span>
          </div>
          <Separator orientation="vertical" className="mx-6 h-auto" />
          <div className="flex flex-col w-1/2">
            <div className="text-sm text-muted-foreground">
              Total Salary Paid
            </div>
            <div className="text-lg font-semibold">
              {formatAmountToNOK(
                data.reduce((sum, row) => sum + row.salary, 0)
              )}
            </div>
          </div>
        </div>
      </div>
      <SimpleDataTable columns={columns} data={data} />
    </div>
  );
};

export default PayrollTab;
