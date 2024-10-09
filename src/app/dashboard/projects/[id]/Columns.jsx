"use client";

import MultiLineNameCell from "@/components/MultiLineNameCell";
import SimpleTableActionsDropdown from "@/components/SimpleTableActionsDropdown";
import { apiClient } from "@/lib/utils";
import { format } from "date-fns";

export const columns = [
  {
    accessorKey: "employeeName",
    header: "Assigned To",
    cell: ({ row }) => {
      console.log(row);
      const { user_name, user_email } = row.original; // Access the full row data
      return (
        <MultiLineNameCell
          // imageUrl={imageUrl}
          title={user_name}
          subtitle={user_email}
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "project_role",
    header: "Role",
    enableSorting: false,
  },
  {
    accessorKey: "utilization",
    header: "Time Allocated",
    enableSorting: false,
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    enableSorting: false,
    cell: ({ row }) => {
      const { start_date } = row.original;
      return <div>{format(start_date, "MMM d, yyyy")}</div>;
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    enableSorting: false,
    cell: ({ row }) => {
      const { end_date } = row.original;
      return <div>{format(end_date, "MMM d, yyyy")}</div>;
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
        const userId = row.original.id;
        try {
          const response = apiClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user_projects/${userId}/${row.original.project_id}/delete/`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            toast.success(
              `${row.original.user_name} deleted successfully from the project.`
            );
          }
        } catch (error) {
          toast.error("There was an error deleting the user");
          console.error("There was an error deleting the user:", error);
        }
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
