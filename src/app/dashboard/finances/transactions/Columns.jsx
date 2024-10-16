"use client";
import React from "react";
import TableActionsDropdown from "@/components/TableActionsDropdown";
import { Badge } from "@/components/ui/badge";
import { formatAmountToNOK, prettifyText } from "@/lib/utils";
import { formInputs } from "@/app/dashboard/finances/revenue/Inputs";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    cell: ({ row }) => {
      const { name } = row.original;
      return name ? name : "No Data"; // Show "No Data" if the name is null or undefined
    },
  },
  {
    accessorKey: "projectName",
    header: "Project Name",
    enableSorting: true,
    cell: ({ row }) => {
      const { projectName } = row.original;
      return projectName ? projectName : "No Data"; // Show "No Data" if the project is null or undefined
    },
  },
  {
    accessorKey: "invoice_no",
    header: "Invoice",
    enableSorting: false,
    cell: ({ row }) => {
      const { invoice_no } = row.original;
      return invoice_no ? invoice_no : "No Data"; // Show "No Data" if the invoice_no is null or undefined
    },
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
      const { status } = row.original;
      return (
        <Badge
          className={`${
            status?.toLowerCase() === "paid"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status ? status : "No Data"} {/* Show "No Data" */}
        </Badge>
      );
    },
    enableSorting: false,
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
    enableSorting: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    enableSorting: false,
    cell: ({ row }) => {
      const { type } = row.original;
      return type ? <span className="capitalize">{type}</span> : "No Data"; // Show "No Data" if the payment_type is null or undefined
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    enableSorting: false,
    cell: ({ row }) => {
      const { amount } = row.original;
      return amount !== null && amount !== undefined
        ? formatAmountToNOK(amount)
        : "No Data"; // Show "No Data" if the amount is null or undefined
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
          <MoreHorizontal className="cursor-pointer" />
        </div>
      );
    },
    enableSorting: false,
  },
];
