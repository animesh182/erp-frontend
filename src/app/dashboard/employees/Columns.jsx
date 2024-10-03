"use client";

import MultiLineNameCell from "@/components/MultiLineNameCell";
import SimpleTableActionsDropdown from "@/components/SimpleTableActionsDropdown";
import { formatAmountToNOK } from "@/lib/utils";

export const columns = [
  {
    accessorKey: "employeeName",
    header: "Employee Name",
    cell: ({ row }) => {
      // console.log(row);
      const { imageUrl, full_name, email } = row.original; // Access the full row data

      return (
        <MultiLineNameCell
          imageUrl={imageUrl}
          title={full_name}
          subtitle={email}
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "role_title",
    header: "Role",
    enableSorting: false,
  },
  {
    accessorKey: "employment_type",
    header: "Type",
    enableSorting: false,
  },
  {
    accessorKey: "salary",
    header: "Salary",
    enableSorting: false,
    cell: ({ row }) => {
      const { salary } = row.original;
      return formatAmountToNOK(salary);
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
