"use client";
import React from "react";
import TableActionsDropdown from "@/components/TableActionsDropdown";
import { Badge } from "@/components/ui/badge";
import { formatAmountToNOK, prettifyText } from "@/lib/utils";
import { formInputs } from "@/app/dashboard/finances/revenue/Inputs";
import { deleteRevenue } from "@/app/api/revenue/deleteRevenue";
import { toast } from "sonner";
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
    cell: ({ row }) => {
      const { paidDate } = row.original;
      return (
        <span>
          {paidDate ? format(new Date(paidDate), "MMM dd yyyy") : "N/A"}
        </span>
      );
    },
    enableSorting: false,
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
        row.original.type === "one-time" ? "One-time" : "Recurring";
      return <span>{paymentType}</span>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    enableSorting: false,
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
      const handleDelete = async () => {
        try {
          await deleteRevenue(row.original.id);
          toast.success("Revenue deleted successfully");
        } catch (error) {
          console.error("Error deleting revenue:", error);
          toast.error("Failed to delete revenue");
        }
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
