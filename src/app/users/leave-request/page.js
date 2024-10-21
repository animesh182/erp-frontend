"use client";

import React, { useState } from "react";
import DataTable from "@/components/ui/data-table";
import { columns } from "./Columns";
import { Button } from "@/components/ui/button";
import { Filter, PlusCircle } from "lucide-react";
import { RequestForLeaveSheet } from "@/components/EditLeaveSheet"; // Import the form component

const LeaveRequest = () => {
  // State to manage the data and the sheet modal
  const [data, setData] = useState([
    {
      leaveReason: "Sick leave (Illness or Injury)",
      startedLeaveDate: "2024-07-01",
      endedLeaveDate: "2024-07-05",
      numberOfLeaveDays: 5,
      typeOfLeave: "Full Day",
      status: "Approved",
      detailedExplanation:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ]);

  const [isSheetOpen, setSheetOpen] = useState(false);

  // Function to handle adding a new leave request
  const handleAddLeaveRequest = (newLeaveRequest) => {
    setData((prevData) => [...prevData, newLeaveRequest]);
    setSheetOpen(false); // Close the sheet after submission
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex justify-end gap-2">
        <Button
          className="flex items-center justify-center gap-3 py-2 h-8"
          variant="outline"
        >
          <Filter className="w-4" />
          Filter
        </Button>

        {/* Open the sheet on button click */}
        <Button
          className="flex items-center justify-center gap-3 py-2 h-8"
          onClick={() => setSheetOpen(true)}
        >
          <PlusCircle className="w-4" />
          Request
        </Button>
      </div>

      <DataTable
        title={"Leave Request"}
        subtitle={
          "View the list of employees assigned to the project along with their time utilization."
        }
        columns={columns}
        data={data} // Pass the updated data to the table
      />

      {/* Render the RequestForLeaveSheet when isSheetOpen is true */}
      <RequestForLeaveSheet
        isOpen={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleAddLeaveRequest} // Pass the function to handle form submission
      />
    </main>
  );
};

export default LeaveRequest;
