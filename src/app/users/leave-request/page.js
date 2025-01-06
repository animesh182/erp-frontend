"use client";

import { createEmployeeLeaveRequest } from "@/app/api/employees/createEmployeeLeaveRequest";
import { deleteLeaveRequestById } from "@/app/api/employees/deleteLeaveRequest";
import { useEmployeeLeaveRequest, useTypeOfLeaves } from "@/app/hooks/employees/useEmployeeLeaveRequest";
import { RequestForLeaveSheet } from "@/components/EditLeaveSheet"; // Import the form component
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { Filter, PlusCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { columns } from "./Columns";
import { ProjectPageSkeletonCard } from "@/components/Skeletons";

const LeaveRequest = () => {

  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");

  const [isSheetOpen, setSheetOpen] = useState(false);
  const{data:typeOfLeave,refetch:refetchType}=useTypeOfLeaves()
  const{data:employeeLeaveRequest=[],isLoading:loading,refetch}=useEmployeeLeaveRequest()
  const handleAddLeaveRequest = async (formData) => {
    try {
      const response = await createEmployeeLeaveRequest(formData, userId);
      toast.success("Leave Request added successfully");
      refetch()
      refetchType()
      setSheetOpen(false);
    } catch (error) {
      toast.error("Failed to create leave request");
      console.error("Error creating leave request:", error.message);
    }

    setSheetOpen(false);
  };


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
        toast.success("Leave request deleted successfully");
        refetch()
      // }
    } catch (error) {
      toast.error("There was an error deleting the leave request");
      console.error("There was an error deleting the leave request:", error);
    }
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

        <Button
          className="flex items-center justify-center gap-3 py-2 h-8"
          onClick={() => setSheetOpen(true)}
        >
          <PlusCircle className="w-4" />
          Request
        </Button>
      </div>

      {loading? 
        <ProjectPageSkeletonCard/> 
          :
        <DataTable
        title={"Leave Request"}
        subtitle={
          "View your list of leave requests."
        }
        columns={columns}
        data={transformedData}
        onDeleteRow={onDeleteLeaveRequest}
        // onEditRow={onUpdateLeaveRequest}
      />}

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
