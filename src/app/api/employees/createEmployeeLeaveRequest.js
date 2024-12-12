import { apiClient } from "@/lib/utils";



export async function createEmployeeLeaveRequest(leaveData) {
  try {
    const formatDate = (date) => {
      if (!date) return null;
      const localDate = new Date(date);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
      return localDate.toISOString().split('T')[0];
    };

    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/leave_records/`,
      {
        method: "POST",
        body: JSON.stringify({
          type_of_leave: leaveData.leaveReason, 
          start_date: formatDate(leaveData.startedLeaveDate),
          end_date: formatDate(leaveData.endedLeaveDate),
          type_of_day: leaveData.typeOfLeave,
          explanation: leaveData.detailedExplanation,
        }),
      }
    );

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to create leave request");
  }
}

