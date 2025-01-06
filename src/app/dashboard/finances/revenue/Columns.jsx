"use client";
import { formInputs } from "@/app/dashboard/finances/revenue/Inputs";
import TableActionsDropdown from "@/components/TableActionsDropdown";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns = [
  {
    //change values to invoice name instead of client name.
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    //change calue to actual project names intead of project type
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
    enableSorting: false,
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
  },

  {
    accessorKey: "status",
    header: "Status",
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
    cell: ({ row }) => {
      const { paidDate } = row.original;

      // Check if the date exists, if not return a fallback value
      if (!paidDate) {
        return <span>N/A</span>; // Fallback when date is null or undefined
      }

      // If date exists, format it
      return <span>{format(new Date(paidDate), "MMM d, yyyy")}</span>;
    },
  },

  {
    accessorKey: "type",
    header: "Type",
    enableSorting: false,
    cell: ({ row }) => {
      const paymentType =
        row.original.type === "One-Time" ? "One-Time" : "Recurring";
      return <span>{paymentType}</span>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    enableSorting: true,
    // cell: ({ row }) => {
    //   const { amount } = row.original;
    //   return formatAmountToNOK(amount);
    // },
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