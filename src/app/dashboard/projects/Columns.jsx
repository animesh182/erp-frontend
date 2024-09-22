"use client";

import MultiLineNameCell from "@/components/MultiLineNameCell";
import ProjectHealth from "@/components/ProjectHealth";
import ProjectTableActionsDropdown from "@/components/ProjectTableActionsDropdown";
import TeamAvatars from "@/components/TeamAvatars";
import { Badge } from "@/components/ui/badge";
import { ProgressTrackingCell } from "@/components/ui/ProgressTrackingCell";
import { formatAmountToNOK } from "@/lib/utils";
import { prettifyText } from "@/lib/utils";

export const projectColumns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const { name, health } = row.original; // Access the full row data
      return (
        <div>
          <p>{name}</p>
          <ProjectHealth health={health} />
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const { projectCategory, platform } = row.original; // Access the full row data
      return (
        <div>
          <p>{projectCategory}</p>
          <p className="text-xs text-muted-foreground">{platform}</p>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const { clientImage, clientName, clientEmail } = row.original; // Access the full row data
      return (
        <MultiLineNameCell
          imageUrl={clientImage}
          title={clientName}
          subtitle={clientEmail}
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original; // Access the full row data
      return (
        <Badge
          className={`${
            status === "done"
              ? "bg-green-100 text-green-800"
              : status === "not-started"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {prettifyText(status)}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "team",
    header: "Team",
    cell: ({ row }) => {
      const { teamMembersImage, teamMembersCount } = row.original; // Access the full row data
      return (
        <TeamAvatars
          teamMembersImage={teamMembersImage}
          teamMembersCount={teamMembersCount}
          size="small"
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "progressTracking",
    header: "Progress Tracking",
    cell: ({ row }) => {
      const rowData = row.original;
      return <ProgressTrackingCell row={rowData} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "timeline",
    header: "Timeline",
    cell: ({ row }) => {
      const { startDate, endDate } = row.original; // Access the full row data
      return (
        <div className="flex">
          <p className="text-xs ">{startDate}</p>
          <p className="text-xs "> - {endDate}</p>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "budget",
    header: "Budget",
    enableSorting: false,
    cell: ({ row }) => {
      const { budget } = row.original; // Access the full row data
      return formatAmountToNOK(budget);
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const rowData = row.original;
      const handleDelete = () => {
        console.log("Delete", row.original.id);
        // Handle delete action
      };

      return (
        <div className="flex items-center">
          <ProjectTableActionsDropdown
            onDelete={handleDelete}
            rowData={rowData}
          />
        </div>
      );
    },
    enableSorting: false,
  },
];
