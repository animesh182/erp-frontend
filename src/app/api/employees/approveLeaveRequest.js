import { apiClient } from "@/lib/utils";

export async function updateLeaveRequestStatus(leaveStatus, id) {
  const transformedData = {
    status: leaveStatus,
  };
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/leave_records/${id}/`,
      // Pass the status to update, e.g., "Approve", "Decline", "Pending"
      { method: "PATCH", body: JSON.stringify(transformedData) }
    );

    if (response) {
      return {
        response,
        message: `Leave request updated successfully`,
      };
    }
  } catch (error) {
    throw new Error(error.message || `Failed to update leave request.`);
  }
}
