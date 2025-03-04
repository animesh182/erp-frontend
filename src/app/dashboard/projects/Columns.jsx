"use client";

import MultiLineNameCell from "@/components/MultiLineNameCell";
import ProjectHealth from "@/components/ProjectHealth";
import ProjectTableActionsDropdown from "@/components/ProjectTableActionsDropdown";
import TeamAvatars from "@/components/TeamAvatars";
import { Badge } from "@/components/ui/badge";
import { ProgressTrackingCell } from "@/components/ui/ProgressTrackingCell";
import { formatAmountToNOK, prettifyText } from "@/lib/utils";
import { format } from "date-fns";
export const projectColumns = (clients) => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const { name, project_health } = row.original; // Access the full row data
      return (
        <div>
          <p>{name || "N/A"}</p>
          {project_health && <ProjectHealth health={project_health} />}
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
    hideOnMobile:true
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const { name, email } = row.original.client_contact; // Access the full row data
      return (
        <MultiLineNameCell
          // imageUrl={"/default-avatar.jpg"}
          title={name}
          subtitle={email}
        />
      );
    },
    enableSorting: false,
    hideOnMobile:true
  },
  {
    accessorKey: "project_status",
    header: "Status",
    cell: ({ row }) => {
      const { project_status } = row.original;// Access the full row data
      return (
        <Badge
          className={`${
            project_status === "Done"
              ? "bg-green-100 text-green-800"
              : project_status === "Not Started"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {prettifyText(project_status)}
        </Badge>
      );
    },
    enableSorting: false,
    hideOnMobile:true
  },
  {
    accessorKey: "team",
    header: "Team",
    cell: ({ row }) => {
      const {  all_user_projects } = row.original; // Access the full row data
      const teamMembers = all_user_projects.map((user) => ({
        name: user.user_name,
        image: null, // You can replace this with a proper avatar URL if available
      }));
      return (
        <TeamAvatars
          teamMembers={teamMembers}
          teamMembersCount={all_user_projects.length}
          size="small"
        />
      );
    },
    enableSorting: false,
    hideOnMobile:true
  },
  {
    accessorKey: "progressTracking",
    header: "Progress Tracking",
    cell: ({ row }) => {
      const rowData = row.original.completion;
      const projectName = row.original.name;
      const projectId = row.original.id;
      return (
        <ProgressTrackingCell
          row={Math.round(rowData)}
          projectName={projectName}
          projectId={projectId}
        />
      );
    },
    enableSorting: false,
    hideOnMobile:true
  },
  {
    accessorKey: "timeline",
    header: "Timeline",
    cell: ({ row }) => {
      const { start_date, completion_date } = row.original; // Access the full row data
      return (
        <div className="flex">
          <p className="text-xs ">{format(start_date, "MMM dd, yyyy")}</p>
          <p className="text-xs ">
            -
            {(completion_date && format(completion_date, "MMM dd, yyyy")) ||
              "Present"}
          </p>
        </div>
      );
    },
    enableSorting: false,
    hideOnMobile:true
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

      return (
        <div className="flex items-center">
          <ProjectTableActionsDropdown rowData={rowData} clients={clients} />
        </div>
      );
    },
    enableSorting: false,
  },
];
