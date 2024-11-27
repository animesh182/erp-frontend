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
      return <MultiLineNameCell title={user_name} subtitle={user_email} />;
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
    cell: ({ row }) => {
      const { utilization } = row.original;
      return <div>{utilization} hrs</div>;
    },
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
      return (
        <div className="flex items-center">
          <SimpleTableActionsDropdown rowData={row.original} />
        </div>
      );
    },
    enableSorting: false,
  },
];
