// "use client";

// import React, { Suspense, useCallback, useEffect, useState } from "react";
// import DataTable from "@/components/ui/data-table";
// import { columns } from "./Columns";
// import { Button } from "@/components/ui/button";
// import { Filter, PlusCircle } from "lucide-react";
// import { RequestForLeaveSheet } from "@/components/EditLeaveSheet"; // Import the form component
// import { getEmployeeLeaveRequest } from "@/app/api/employees/getEmployeeLeaveRequest";
// import { toast } from "sonner";
// import { deleteLeaveRequestById } from "@/app/api/employees/deleteLeaveRequest";
// import ComboboxEmployees from "@/app/users/leave-request/combobox";
// import { formInputs } from "./Inputs";


// const LeaveRequest = () => {
//   const [employeeLeaveRequest, setEmployeeLeaveRequest] = useState([]);
//   const [refreshKey, setRefreshKey] = useState(0);
  


//   const refreshComponent = useCallback(() => {
//     setRefreshKey((prevKey) => prevKey + 1);
//   }, []);

//   useEffect(() => {
//     const getLeaveRecords = async () => {
//       try {
//         const data = await getEmployeeLeaveRequest();

//         if (data) {
//           setEmployeeLeaveRequest(data);
//         } else {
//           console.error("Failed to fetch employee data");
//         }
//       } catch (error) {
//         console.error("Error fetching employee details:", error);
//       }
//     };

//     getLeaveRecords();
//   }, [refreshKey]);

//   const transformedData = employeeLeaveRequest.map((leaveRequest) => {
//     const startDate = new Date(leaveRequest.start_date);
//     const endDate = new Date(leaveRequest.end_date);

//     const numberOfLeaveDays =
//       Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

//     return {
//       id: leaveRequest.id,
//       employeeName: leaveRequest.username,
//       leaveReason: leaveRequest.type_of_leave,
//       typeOfLeave: leaveRequest.type_of_day,
//       startedLeaveDate: leaveRequest.start_date,
//       endedLeaveDate: leaveRequest.end_date,
//       detailedExplanation: leaveRequest.explanation,
//       status: leaveRequest.status,
//       numberOfLeaveDays,
//     };
//   });

//   const handleStatusUpdate = useCallback((id, newStatus) => {
//     setEmployeeLeaveRequest(prevData => 
//       prevData.map(item => 
//         item.id === id 
//           ? { ...item, status: newStatus }
//           : item
//       )
//     );
//   }, []);

//   const onDeleteLeaveRequest = async (leaveRequestId) => {
//     try {
//       const response = await deleteLeaveRequestById(leaveRequestId);
//       console.log(response, "resres");
//       toast.success("Leave request deleted successfully");
//       refreshComponent();
//     } catch (error) {
//       toast.error("There was an error deleting the leave request");
//       console.error("There was an error deleting the leave request:", error);
//     }
//   };

//   const employeeNames = transformedData.map((emp) => emp.employeeName);

//   return (
//     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//       <div className="flex justify-end gap-2">
//         <ComboboxEmployees employeeNames={employeeNames} />
//       </div>
//       <DataTable
//         title={"Leave Request"}
//         subtitle={
//           "View the list of employees assigned to the project along with their time utilization."
//         }
//         columns={columns(handleStatusUpdate)}
//         data={transformedData}
//         onDeleteRow={onDeleteLeaveRequest}
//         formInputs={formInputs}
//         filterColumn={"status"}
//       />
//     </main>
//   );
// };

// export default LeaveRequest;


"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import DataTable from "@/components/ui/data-table";
import { columns } from "./Columns";
import { Button } from "@/components/ui/button";
import { Filter, PlusCircle } from "lucide-react";
import { RequestForLeaveSheet } from "@/components/EditLeaveSheet"; 
import { getEmployeeLeaveRequest } from "@/app/api/employees/getEmployeeLeaveRequest";
import { toast } from "sonner";
import { deleteLeaveRequestById } from "@/app/api/employees/deleteLeaveRequest";
import ComboboxEmployees from "@/app/users/leave-request/combobox";
import { formInputs } from "./Inputs";

const LeaveRequest = () => {
  const [employeeLeaveRequest, setEmployeeLeaveRequest] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState("");

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

  const transformedData = employeeLeaveRequest
    .filter(leaveRequest => 
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
    setEmployeeLeaveRequest(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { ...item, status: newStatus }
          : item
      )
    );
  }, []);

  const onDeleteLeaveRequest = async (leaveRequestId) => {
    try {
      const response = await deleteLeaveRequestById(leaveRequestId);
      toast.success("Leave request deleted successfully");
      refreshComponent();
    } catch (error) {
      toast.error("There was an error deleting the leave request");
      console.error("There was an error deleting the leave request:", error);
    }
  };

  const employeeNames = [...new Set(employeeLeaveRequest.map((emp) => emp.username))];

  const handleSelectEmployee = (employeeName) => {
    setSelectedEmployee(employeeName);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex justify-end gap-2">
        <ComboboxEmployees 
          employeeNames={employeeNames} 
          onSelectEmployee={handleSelectEmployee}
        />
      </div>
      <DataTable
        title={"Leave Request"}
        subtitle={
          selectedEmployee 
            ? `Leave Requests for ${selectedEmployee}` 
            : "View the list of employees assigned to the project along with their time utilization."
        }
        columns={columns(handleStatusUpdate)}
        data={transformedData}
        onDeleteRow={onDeleteLeaveRequest}
        formInputs={formInputs}
        filterColumn={"status"}
      />
    </main>
  );
};

export default LeaveRequest;