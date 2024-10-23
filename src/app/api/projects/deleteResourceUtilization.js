import { apiClient } from "@/lib/utils";

export async function deleteResourceUtilization(userId, projectId) {
  try {
    const result = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user_projects/${userId}/${projectId}/delete/`,
      {
        method: "DELETE",
      }
    );

    return {
      success: true,
      message: "Resource utilization deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting resource utilization:", error);
    return {
      success: false,
      message: error.message || "Failed to delete resource utilization",
    };
  }
}
