import { apiClient } from "@/lib/utils";

export async function createEmployeeLeaveRequest(leaveData) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/leave_records/`,
      {
        method: "POST",
        body: JSON.stringify({
          type_of_leave: getTypeOfLeave(leaveData.leaveReason), 
          start_date: leaveData.startedLeaveDate 
          ? new Date(leaveData.startedLeaveDate).toISOString().split('T')[0] 
          : null,
end_date: leaveData.endedLeaveDate 
        ? new Date(leaveData.endedLeaveDate).toISOString().split('T')[0] 
        : null,
          type_of_day: leaveData.typeOfLeave,
          explanation: leaveData.detailedExplanation,
        
        }),
      }
    );

    // Return the response data
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to create leave request");
  }
}


const getTypeOfLeave = (leaveReason) => {
  switch (leaveReason) {
    case "Sick leave (Illness or Injury)":
      return 1;
    case "Bereavement leave":
      return 2;
    case "Vacation leave":
      return 3;
    case "Leave without pay":
      return 4;
   
  }
};