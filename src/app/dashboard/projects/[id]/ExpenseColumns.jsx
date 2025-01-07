    "use client";

    import MultiLineNameCell from "@/components/MultiLineNameCell";
    import SimpleTableActionsDropdown from "@/components/SimpleTableActionsDropdown";
import { formatAmountToNOK } from "@/lib/utils";
    import { format } from "date-fns";


    export const expenseColumns = [

    {
        accessorKey: "invoiceNumber",
        header: "Invoice",
        cell: ({ row }) => {
        const { invoice_no } = row.original; // Access the full row data
        return invoice_no;
        },
        enableSorting: false,
    },
    {
        accessorKey: "invoiceName",
        header: "Name",
        cell: ({ row }) => {
        const { name } = row.original; // Access the full row data
        return name;
        },
        enableSorting: true,
    },
    {
        accessorKey: "issueDate",
        header: "Issued Date",
        cell: ({ row }) => {
        const { issued_date } = row.original; // Access the full row data
        return issued_date;
        },
        enableSorting: true,
    },
    {
        accessorKey: "paymentStatus",
        header: "Payment Status",
        cell: ({ row }) => {
        const { payment_status } = row.original; // Access the full row data
        return payment_status;
        },
        enableSorting: true,
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
        const { amount } = row.original; // Access the full row data
        return formatAmountToNOK(amount);
        },
        enableSorting: true,
    },
    ];

