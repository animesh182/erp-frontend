    "use client";

    import MultiLineNameCell from "@/components/MultiLineNameCell";
    import SimpleTableActionsDropdown from "@/components/SimpleTableActionsDropdown";
import { Badge } from "@/components/ui/badge";
import { formatAmountToNOK } from "@/lib/utils";
    import { format } from "date-fns";


    export const expenseColumns = [

    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
        const { name } = row.original; // Access the full row data
        return name;
        },
        enableSorting: true,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
        const { description } = row.original; // Access the full row data
        return description;
        },
        enableSorting: false,
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
        const { date } = row.original; // Access the full row data
        return date;
        },
        enableSorting: true,
    },
    {
        accessorKey: "source",
        header: "Source",
        cell: ({ row }) => {
        const { source } = row.original; // Access the full row data
        return source;
        },
        enableSorting: false,
    },
    // {
    //     accessorKey: "paymentStatus",
    //     header: "Payment Status",
    //     cell: ({ row }) => {
    //     const { payment_status } = row.original; // Access the full row data
    //     return  (
    //             <Badge
    //             className={`${
    //                 payment_status === "Paid"
    //                 ? "bg-green-100 text-green-800"
    //                 : payment_status === "Pending"
    //                 ? "bg-yellow-100 text-yellow-800"
    //                 : payment_status === "Cancelled"
    //                 ? "bg-red-100 text-red-800"
    //                 : payment_status==="Budget"
    //                 ? "bg-orange-200 text-orange-800":"bg-gray-100 text-black"
    //             }`}
    //             >
    //             {payment_status || "No Data"} {/* Show "No Data" if status is empty */}
    //             </Badge>
    //       );
    //     },
    //     enableSorting: true,
    // },
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

