"use client";

import MultiLineNameCell from "@/components/MultiLineNameCell";
import SimpleTableActionsDropdown from "@/components/SimpleTableActionsDropdown";
import { formatAmountToNOK } from "@/lib/utils";
import { useDeleteEmployee } from "@/sevices/useEmployeeServices";

export const columns = [
  {
    accessorKey: "employeeName",
    header: "Employee Name",
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
    accessorKey: "type",
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



      const{mutate:deleteEmployee}=useDeleteEmployee()
      const handleDelete = () => {
        console.log("Delete", row.original.id);
        if (window.confirm(`Are you sure you want to delete employee of id ${row.original.id} ?`)) {
          deleteEmployee(row.original.id); 
        }
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
