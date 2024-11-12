"use client";

export const columns = [
  {
    accessorKey: "team_member",
    header: "Team Member",
    enableSorting: true,
  },
  {
    accessorKey: "latest_activity",
    header: "Latest Activity",
    enableSorting: false,
  },
  {
    accessorKey: "time",
    header: "Time",
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
  },
  {
    accessorKey: "time_tracked",
    header: "Total Time Tracked (This Week)",
    enableSorting: false,
  },
];
