"use client";

import EmployeeTableActionsDropdown from "@/components/EmployeeTableActionsDropdown";
import MultiLineNameCell from "@/components/MultiLineNameCell";
import { formatAmountToNOK } from "@/lib/utils";
export const columns = [
  {
    accessorKey: "employeeName",
    header: "Employee Name",
    cell: ({ row }) => {
      console.log(row);
      const { imageUrl, full_name, email, end_date } = row.original; // Access the full row data

      return (
        <MultiLineNameCell
          imageUrl={imageUrl}
          title={full_name}
          subtitle={email}
          isActive={end_date ? false : true}
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
    accessorKey: "level",
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
      return (
        <div className="flex items-center">
          <EmployeeTableActionsDropdown rowData={row.original} />
        </div>
      );
    },
    enableSorting: false,
  },
];
