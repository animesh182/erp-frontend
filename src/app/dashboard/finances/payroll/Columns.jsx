"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatAmountToNOK } from "@/lib/utils";
import TableActionsDropdown from "@/components/TableActionsDropdown";
import { format } from "date-fns";
import { formInputs } from "./Inputs";

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
    cell: ({ row }) => {
      const { projectName } = row.original;
      return (
        <span className="capitalize flex justify-center">
          {!!projectName ? projectName : "-"}
        </span>
      );
    },
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
    enableSorting: false,
  },
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
    cell: ({ row }) => {
      const { paidDate } = row.original;
      return (
        <span>
          {paidDate ? format(new Date(paidDate), "MMM dd yyyy") : "N/A"}
        </span>
      );
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

      return (
        <div className="flex items-center">
          <TableActionsDropdown rowData={rowData} formInputs={formInputs} />
        </div>
      );
    },
    enableSorting: false,
  },
];
