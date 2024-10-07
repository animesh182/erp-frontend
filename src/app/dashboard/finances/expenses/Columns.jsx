"use client";
import React from "react";
import TableActionsDropdown from "@/components/TableActionsDropdown";
import { Badge } from "@/components/ui/badge";
import { formatAmountToNOK, prettifyText } from "@/lib/utils";
import { formInputs } from "@/app/dashboard/finances/expenses/Inputs";
import { format } from "date-fns";

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
  // {
  //   accessorKey: "invoiceIssuedDate",
  //   header: "Invoice Issued Date",
  //   enableSorting: false,
  //   cell: ({ row }) => {
  //     const { invoiceDate } = row.original;
  //     return <span>{format(invoiceDate, "MMM d, yyyy")}</span>;
  //   },
  // },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original; // Access the full row data
      return (
        <Badge
          className={`${
            status === "paid"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "paidDate",
    header: "Paid Date",
    enableSorting: false,
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
    enableSorting: false,
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

      const handleDelete = () => {
        console.log("Delete", row.original.id);
        // Handle delete action
      };

      return (
        <div className="flex items-center">
          <TableActionsDropdown
            rowData={rowData}
            onDelete={handleDelete}
            formInputs={formInputs}
          />
        </div>
      );
    },
    enableSorting: false,
  },
];
