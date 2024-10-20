"use client";

import MultiLineNameCell from "@/components/MultiLineNameCell";
import SimpleTableActionsDropdown from "@/components/SimpleTableActionsDropdown";
import { deleteResourceUtilization } from "@/app/api/projects/deleteResourceUtilization";
import { format } from "date-fns";
import { toast } from "sonner";

export const columns = [
  {
    accessorKey: "employeeName",
    header: "Assigned To",
    cell: ({ row }) => {
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
      return (
        <div>
          {start_date ? format(new Date(start_date), "MMM dd yyyy") : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    enableSorting: false,
    cell: ({ row }) => {
      const { end_date } = row.original;
      return (
        <div>
          {end_date ? format(new Date(end_date), "MMM dd yyyy") : "Present"}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const handleDelete = async () => {
        console.log(row.original, "row.original");
        const userId = row.original.user_id;
        const projectId = row.original.project_id;
        try {
          const result = await deleteResourceUtilization(userId, projectId);
          if (result.success) {
            toast.success(
              `${row.original.user_name} deleted successfully from the project.`
            );
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          toast.error("There was an error deleting the user");
          console.error("There was an error deleting the user:", error);
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
