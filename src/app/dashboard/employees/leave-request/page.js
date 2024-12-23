

"use client";

import { useEmployeeLeaveRequest, useTypeOfLeaves } from "@/app/hooks/employees/useEmployeeLeaveRequest";
import { useAddLeaveRequest, useDeleteLeaveRequest, useUpdateLeaveRequestStatus } from "@/app/services/useEmployeeServices";
import ComboboxEmployees from "@/app/users/leave-request/combobox";
import { RequestForLeaveSheet } from "@/components/EditLeaveSheet";
import { ProjectPageSkeletonCard, TitleSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { useClockify } from "@/context/clockifyContext/ClockifyContext";
import { PlusCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { columns } from "./Columns";
import { formInputs } from "./Inputs";

const LeaveRequest = () => {
  // const [employeeLeaveRequest, setEmployeeLeaveRequest] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  // const [loading, setLoading] = useState(true);
  const [isSheetOpen, setSheetOpen] = useState(false);
  // const[typeOfLeave,setTypeOfLeave]=useState([])
  const {clockifyUserData}=useClockify()

  const{data:employeeLeaveRequest,isLoading:loading}=useEmployeeLeaveRequest()
  const{data:typeOfLeave}=useTypeOfLeaves()



  const refreshComponent = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);



  const { mutate: updateStatus } = useUpdateLeaveRequestStatus();
  const { mutate: onDeleteLeaveRequest } = useDeleteLeaveRequest();
  const { mutate: addLeaveRequest } = useAddLeaveRequest({
    onSuccess: () => {
      setSheetOpen(false);
    }
  });

  const handleAddLeaveRequest = (formData) => {
    if (clockifyUserData?.id) {
      addLeaveRequest({ 
        formData: { ...formData, status: "Pending" },
        userId: clockifyUserData.id 
      });
    }
  };
  const transformedData = employeeLeaveRequest.filter(leaveRequest => 
      !selectedEmployee || leaveRequest.username === selectedEmployee
    )
    .map((leaveRequest) => {
      const startDate = new Date(leaveRequest.start_date);
      const endDate = new Date(leaveRequest.end_date);

      const numberOfLeaveDays =
        Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      return {
        id: leaveRequest.id,
        employeeName: leaveRequest.username,
        leaveReason: leaveRequest.type_of_leave,
        typeOfLeave: leaveRequest.type_of_day,
        startedLeaveDate: leaveRequest.start_date,
        endedLeaveDate: leaveRequest.end_date,
        detailedExplanation: leaveRequest.explanation,
        status: leaveRequest.status,
        numberOfLeaveDays,
      };
    });

  const handleStatusUpdate = useCallback((id, newStatus) => {
    updateStatus({ id, newStatus });
  }, [updateStatus]);


  const employeeNames = [...new Set(employeeLeaveRequest.map((emp) => emp.username))];

  const handleSelectEmployee = (employeeName) => {
    setSelectedEmployee(employeeName);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex justify-end gap-2 items-center">
      <Button
          className="flex items-center justify-center gap-3 py-2 h-8"
          onClick={() => setSheetOpen(true)}
        >
          <PlusCircle className="w-4" />
          Request
        </Button>
        <ComboboxEmployees 
          employeeNames={employeeNames} 
          onSelectEmployee={handleSelectEmployee}
        />
      </div>
          {loading?
                  <div className="space-y-4"> 
                    <TitleSkeleton/>
                    <ProjectPageSkeletonCard/>
                    </div>
                  :
      <DataTable
        title={"Leave Request"}
        subtitle={
          selectedEmployee 
            ? `Leave Requests for ${selectedEmployee}` 
            : "View the list of leave requests of employees ."
        }
        columns={columns(handleStatusUpdate)}
        data={transformedData}
        onDeleteRow={onDeleteLeaveRequest}
        formInputs={formInputs}
        filterColumn={"status"}
      />
}
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