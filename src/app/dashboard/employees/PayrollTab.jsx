import React from "react";
import SimpleDataTable from "@/components/ui/simple-data-table";
import { formatAmountToNOK } from "@/lib/utils";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

const PayrollTab = ({ payrollData }) => {
  const data = payrollData;
  // console.log(data);
  const columns = [
    {
      accessorKey: "description",
      header: "Name",
    },
    {
      accessorKey: "payment_date",
      header: "Payment Date",
      cell: ({ row }) =>
        format(new Date(row.original.payment_date), "MMM d, yyyy"),
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "amount",
      header: "Salary",
      cell: ({ row }) => formatAmountToNOK(row.original.amount),
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
                data.reduce((sum, row) => {
                  return sum + parseFloat(row.amount);
                }, 0)
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
