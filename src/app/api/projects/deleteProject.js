import { apiClient } from "@/lib/utils";

export async function deleteProject(projectId) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/project/${projectId}/`,
      {
        method: "DELETE",
      }
    );

    // Return the response data
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to delete project");
  }
}
