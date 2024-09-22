"use client";

import MultiLineNameCell from "@/components/MultiLineNameCell";
import SimpleTableActionsDropdown from "@/components/SimpleTableActionsDropdown";
import { format } from "date-fns";

export const columns = [
  {
    accessorKey: "employeeName",
    header: "Assigned To",
    cell: ({ row }) => {
      const { imageUrl, employeeName, email } = row.original; // Access the full row data
      return (
        <MultiLineNameCell
          imageUrl={imageUrl}
          title={employeeName}
          subtitle={email}
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "role",
    header: "Role",
    enableSorting: false,
  },
  {
    accessorKey: "timeAllocated",
    header: "Time Allocated",
    enableSorting: false,
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    enableSorting: false,
    cell: ({ row }) => {
      const { startDate } = row.original;
      return <div>{format(startDate, "MMM d, yyyy")}</div>;
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    enableSorting: false,
    cell: ({ row }) => {
      const { endDate } = row.original;
      return <div>{format(endDate, "MMM d, yyyy")}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const handleEdit = () => {
        console.log("Edit", row.original.id);
        // Handle edit action
      };

      const handleDelete = () => {
        console.log("Delete", row.original.id);
        // Handle delete action
      };

      return (
        <div className="flex items-center">
          <SimpleTableActionsDropdown onDelete={handleDelete} />
        </div>
      );
    },
    enableSorting: false,
  },
];
