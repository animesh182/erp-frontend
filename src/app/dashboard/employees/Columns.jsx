"use client";

import MultiLineNameCell from "@/components/MultiLineNameCell";
import SimpleTableActionsDropdown from "@/components/SimpleTableActionsDropdown";
import { formatAmountToNOK } from "@/lib/utils";
import { deleteEmployeeById } from "@/app/api/employees/deleteEmployeeById";
import { toast } from "sonner";
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
      const handleDelete = async () => {
        console.log("Delete", row.original.id);
        try {
          const response = await deleteEmployeeById(row.original.id);
          if (response.status === 200) {
            toast.message("Employee deleted successfully");
            // You can add any other logic here, like updating UI or showing a success message
          } else {
            toast.error("There was an error deleting the employee");
            console.error(response.message);
            // Handle error case
          }
        } catch (error) {
          console.error("Error deleting employee:", error);
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
