import { apiClient } from "@/lib/utils";

export async function editProject(projectId, formData) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/project/${projectId}/`,
      {
        method: "PATCH",
        body: JSON.stringify({
          name: formData.name,
          amount: formData.budget,
          start_date: formData.startDate,
          budget: formData.budget,
          project_category: formData.projectCategory,
          type: formData.type,
          client: formData.client,
          project_status: formData.status,
          completion: formData.progress,
          project_health: formData.health,
          platform: formData.platform,
          client_email: formData.clientEmail,
          teamMembersCount: formData.teamMembersCount,
          completion_date: formData.endDate,
          description: formData.projectDescription,
        }),
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.message || "Failed to edit project");
  }
}
