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
      const { name, project_health } = row.original; // Access the full row data
      return (
        <div>
          <p>{name}</p>
          <ProjectHealth health={project_health} />
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const { project_category, platform } = row.original; // Access the full row data
      return (
        <div>
          <p>{project_category || "No Data"}</p>
          <p className="text-xs text-muted-foreground">
            {platform || "No Data"}
          </p>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const { name, email } = row.original.client_contact; // Access the full row data
      return (
        <MultiLineNameCell
          imageUrl={"/default-avatar.jpg"}
          title={name}
          subtitle={email}
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { project_status } = row.original; // Access the full row data
      return (
        <Badge
          className={`${
            project_status === "1"
              ? "bg-green-100 text-green-800"
              : project_status === "2"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {prettifyText(
            project_status === "1"
              ? "Done"
              : project_status === "2"
              ? "Not Started"
              : "Ongoing"
          )}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "team",
    header: "Team",
    cell: ({ row }) => {
      const { teamMembersImage, all_user_projects } = row.original; // Access the full row data
      return (
        <TeamAvatars
          teamMembersImage={["/default-avatar.jpg", "/default-avatar.jpg"]}
          teamMembersCount={all_user_projects.length}
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
      const rowData = row.original.completion;
      const projectName = row.original.name;
      return (
        <ProgressTrackingCell
          row={Math.round(rowData)}
          projectName={projectName}
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "timeline",
    header: "Timeline",
    cell: ({ row }) => {
      const { start_date, end_date } = row.original; // Access the full row data
      return (
        <div className="flex">
          <p className="text-xs ">{start_date}</p>
          <p className="text-xs "> - {end_date}</p>
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
