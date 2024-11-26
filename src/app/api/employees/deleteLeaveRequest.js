import { deleteApiClient } from "@/lib/utils";

export async function deleteLeaveRequestById( leaveRequestId) {
  try {
    const response = await deleteApiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/leave_records/${leaveRequestId}/`,
      { method: "DELETE" }
    );
    if (response.status === 404) {
      console.warn("Resource already deleted or not found.");
      return { message: "Leave request deleted successfully" };
    }
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to delete leave request");
  }
}
