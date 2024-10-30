import { apiClient } from "@/lib/utils";

export async function getEmployeeLeaveRequest(userId) {
    try {
      const response = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leave_records/?user_id=${userId}`
      );
      return  response;
    } catch (error) {
      return {
        status: error.status || 500,
        message: error.message || "Failed to fetch the employee's leave request",
      };
    }
  }