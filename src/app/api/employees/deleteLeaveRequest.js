import { deleteApiClient } from "@/lib/utils";

// export async function deleteLeaveRequestById(userId,leaveRequestId) {
//   try {
//     const result = await deleteApiClient(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/leave_records/${userId}/${leaveRequestId}`,
//       {
//         method: "DELETE",
//       }
//     );
//     console.log(result,"resususu")
//     if (result === true || result.status===404) {
//       return { success: true, message: "Leave request deleted successfully" };
//     } else {
//       throw new Error("Unexpected response from server");
//     }
//   } catch (error) {
//     console.error("Error deleting leave request:", error);
//     return {
//       success: false,
//       message: error.message || "Failed to delete leave request",
//     };
//   }
// }


export async function deleteLeaveRequestById(userId, leaveRequestId) {
  try {
    const response = await deleteApiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/leave_records/${userId}/${leaveRequestId}/`,
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