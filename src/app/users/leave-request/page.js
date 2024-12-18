"use client";

import { createEmployeeLeaveRequest } from "@/app/api/employees/createEmployeeLeaveRequest";
import { deleteLeaveRequestById } from "@/app/api/employees/deleteLeaveRequest";
import { getEmployeeLeaveRequestById } from "@/app/api/employees/getEmployeeLeaveRequest";
import { RequestForLeaveSheet } from "@/components/EditLeaveSheet"; // Import the form component
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { Filter, PlusCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { columns } from "./Columns";
import { getTypeOfLeave } from "@/app/api/typeOfLeave/getTypeOfLeave";

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
  const[typeOfLeave,setTypeOfLeave]=useState([])
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");

  const [isSheetOpen, setSheetOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshComponent = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);
  const handleAddLeaveRequest = async (formData) => {
    try {
      const response = await createEmployeeLeaveRequest(formData, userId);
      toast.success("Leave Request added successfully");
      refreshComponent();
      setSheetOpen(false);
    } catch (error) {
      toast.error("Failed to create leave request");
      console.error("Error creating leave request:", error.message);
    }

    setSheetOpen(false);
  };

  useEffect(() => {
    const getLeaveRecords = async () => {
      try {
        const data = await getEmployeeLeaveRequestById(userId);

        if (data) {
          setEmployeeLeaveRequest(data);
        } else {
          console.error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };
    
      const getLeaveTypes = async () => {
        try {
          const data = await getTypeOfLeave();
  
          if (data) {
            setTypeOfLeave(data);
          } else {
            console.error("Failed to fetch leave data");
          }
        } catch (error) {
          console.error("Error fetching leave types:", error);
        }
      };
  
      
      
      getLeaveRecords();
      getLeaveTypes();
    }, [refreshKey]);

 

  const transformedData = employeeLeaveRequest.map((leaveRequest) => {
    const startDate = new Date(leaveRequest.start_date);
    const endDate = new Date(leaveRequest.end_date);

    const numberOfLeaveDays =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    return {
      id: leaveRequest.id,
      leaveReason:
        leaveRequest.type_of_leave,

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
      const response = await deleteLeaveRequestById( leaveRequestId);
      // console.log(response,"responesesese")
      // if (response && response.message) {
        // toast.success(response.message);
        toast.success("Leave request deleted successfully");
        refreshComponent();
      // }
    } catch (error) {
      toast.error("There was an error deleting the leave request");
      console.error("There was an error deleting the leave request:", error);
    }
  };
  // const onUpdateLeaveRequest = async (leaveRequestId) => {
  //   try {
  //     const response = await updateLeaveRequestStatus(leaveRequestId);
  //     if (response && response.message) {
  //       toast.success(response.message);
  //       refreshComponent();
  //     }
  //   } catch (error) {
  //     toast.error("There was an error editing the leave request status");
  //     console.error(
  //       "There was an error editing the leave request status:",
  //       error
  //     );
  //   }
  // };





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
          "View your list of leave requests."
        }
        columns={columns}
        data={transformedData}
        onDeleteRow={onDeleteLeaveRequest}
        // onEditRow={onUpdateLeaveRequest}
      />

      <RequestForLeaveSheet
        isOpen={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleAddLeaveRequest}
        data={typeOfLeave.data}
      />
    </main>
  );
};

export default LeaveRequest;
