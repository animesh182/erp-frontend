"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import DataTable from "@/components/ui/data-table";
import { columns } from "./Columns";
import { Button } from "@/components/ui/button";
import { Filter, PlusCircle } from "lucide-react";
import { RequestForLeaveSheet } from "@/components/EditLeaveSheet"; // Import the form component
import { getEmployeeLeaveRequest } from "@/app/api/employees/getEmployeeLeaveRequest";
import { toast } from "sonner";
import { deleteLeaveRequestById } from "@/app/api/employees/deleteLeaveRequest";
import ComboboxEmployees from "@/app/users/leave-request/combobox";
import { formInputs } from "./Inputs";

const LeaveRequest = () => {
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

  const [employeeLeaveRequest, setEmployeeLeaveRequest] = useState([]);

  const [isSheetOpen, setSheetOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshComponent = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);


  useEffect(() => {
    const getLeaveRecords = async () => {
      try {
        const data = await getEmployeeLeaveRequest();

        if (data) {
          setEmployeeLeaveRequest(data);
        } else {
          console.error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    getLeaveRecords();
  }, [refreshKey]);

  const transformedData = employeeLeaveRequest.map((leaveRequest) => {
    const startDate = new Date(leaveRequest.start_date);
    const endDate = new Date(leaveRequest.end_date);

    const numberOfLeaveDays =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    return {
      id: leaveRequest.id,
      employeeName:leaveRequest.username,
      leaveReason:
        leaveRequest.type_of_leave ,

      typeOfLeave: leaveRequest.type_of_day,
      startedLeaveDate: leaveRequest.start_date,
      endedLeaveDate: leaveRequest.end_date,
      detailedExplanation: leaveRequest.explanation,
      status: leaveRequest.status,
      numberOfLeaveDays,
    };
  });

  const onDeleteLeaveRequest = async (leaveRequestId) => {
    try {
      const response = await deleteLeaveRequestById(leaveRequestId);
      if (response && response.message) {
        toast.success(response.message);
        refreshComponent();
      }
    } catch (error) {
      toast.error("There was an error deleting the leave request");
      console.error("There was an error deleting the leave request:", error);
      refreshComponent();
    }
  };

  // const onUpdateLeaveRequestStatus = async (id) => {
  //   try {
  //     const response = await updateLeaveRequestStatus(id);
  //     if (response && response.message) {
  //       toast.success(response.message);
  //       refreshComponent(); // Refresh the component to reflect the new status
  //     }
  //   } catch (error) {
  //     toast.error(`There was an error updating the leave request`);
  //     console.error(`Error updating leave request:`, error);
  //     refreshComponent();
  //   }
  // };

  const employeeNames=transformedData.map((emp)=>{
    return emp.employeeName
  })


  console.log(employeeNames,"anmanam")
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex justify-end gap-2">
        <ComboboxEmployees employeeNames={employeeNames}/>
      </div>
      <DataTable
        title={"Leave Request"}
        subtitle={
          "View the list of employees assigned to the project along with their time utilization."
        }
        columns={columns}
        data={transformedData}
        onDeleteRow={onDeleteLeaveRequest}
        formInputs={formInputs}
        filterColumn={"status"}
        // onUpdateLeaveRequestStatus={onUpdateLeaveRequestStatus}
      />

      {/* <RequestForLeaveSheet
        isOpen={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleAddLeaveRequest}
      /> */}
    </main>
  );
};

export default LeaveRequest;
