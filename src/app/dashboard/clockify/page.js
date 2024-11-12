import PieChartwithBarChart from "@/components/charts/PieChartwithBarChart";
import DataTable from "@/components/ui/data-table";
import React from "react";

import { columns } from "./Columns";

const dummyData = [
  {
    team_member: "John Doe",
    latest_activity: "Code Review",
    time: "10:15 AM",
    status: "Active",
    time_tracked: "12h 30m",
  },
  {
    team_member: "Jane Smith",
    latest_activity: "Design Mockups",
    time: "09:45 AM",
    status: "In Progress",
    time_tracked: "15h 20m",
  },
  {
    team_member: "Alex Johnson",
    latest_activity: "Client Meeting",
    time: "11:30 AM",
    status: "Completed",
    time_tracked: "8h 45m",
  },
  {
    team_member: "Emily Davis",
    latest_activity: "Documentation",
    time: "02:10 PM",
    status: "Pending",
    time_tracked: "5h 10m",
  },
  {
    team_member: "Michael Brown",
    latest_activity: "Testing",
    time: "01:20 PM",
    status: "Active",
    time_tracked: "10h 55m",
  },
];

const Clockify = () => {
  return (
    <div className="grid grid-cols-1 p-6 gap-4">
      <span className="font-semibold text-2xl">Clockify</span>
      <div>
        <PieChartwithBarChart />
      </div>

      <DataTable
        columns={columns}
        data={dummyData}
        title={"Team Activities"}
        subtitle={
          "View detailed information aboView detailed information about all team activities in this table."
        }
      />
    </div>
  );
};

export default Clockify;
