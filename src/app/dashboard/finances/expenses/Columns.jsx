"use client";
import { formInputs } from "@/app/dashboard/finances/expenses/Inputs";
import TableActionsDropdown from "@/components/TableActionsDropdown";
import { Badge } from "@/components/ui/badge";
import { formatAmountToNOK } from "@/lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export const columns = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "projectName",
    header: "Project Name",
    enableSorting: true,
  },
  {
    accessorKey: "invoice",
    header: "Invoice",
    enableSorting: false,
  },
  {
    accessorKey: "invoiceIssuedDate",
    header: "Invoice Issued Date",
    cell: ({ row }) => {
      const { invoiceIssuedDate } = row.original;
      return (
        <span>
          {invoiceIssuedDate
            ? format(new Date(invoiceIssuedDate), "MMM dd yyyy")
            : "N/A"}
        </span>
      );
    },
    enableSorting: true,
  },
{
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Select
          onValueChange={(value) => {
            if (value === "all") {
              column.setFilterValue(undefined); // Clear filter for "all"
            } else {
              column.setFilterValue(value); // Set filter for specific value
            }
          }}
          defaultValue="all"
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
    cell: ({ row }) => {
      const { status } = row.original; // Access the `status` value for this row
      return (
        <Badge
          className={`${
            status === "Paid"
              ? "bg-green-100 text-green-800"
              : status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : status === "Cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-orange-200 text-orange-800"
          }`}
        >
          {status || "No Data"} {/* Show "No Data" if status is empty */}
        </Badge>
      );
    },
    enableSorting: false, // Disable sorting for this column
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true; // Show all rows when no filter is selected
      return row.getValue(columnId) === filterValue; // Only show rows that match the selected status
    },
  },
  {
    accessorKey: "paidDate",
    header: "Paid Date",
    cell: ({ row }) => {
      const { paidDate } = row.original;
      return (
        <span>
          {paidDate ? format(new Date(paidDate), "MMM dd yyyy") : "N/A"}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "costType",
    header: "Cost Type",
    enableSorting: false,
    cell: ({ row }) => {
      const { costType } = row.original;
      return <span className="capitalize">{costType}</span>;
    },
  },

  {
    accessorKey: "type",
    header: "Type",
    enableSorting: false,
    cell: ({ row }) => {
      const { type } = row.original;
      return <span className="capitalize">{type}</span>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    enableSorting: true,
    cell: ({ row }) => {
      const { amount } = row.original;
      return formatAmountToNOK(amount);
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <div className="flex items-center">
          <TableActionsDropdown rowData={rowData} formInputs={formInputs} />
        </div>
      );
    },
    enableSorting: false,
  },
];



const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'Paid' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Budget', value: 'Budget' },
  { label: 'Cancelled', value: 'Cancelled' }
];