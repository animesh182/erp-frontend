import { apiClient } from "@/lib/utils";

export async function createProject(projectData) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/project/`,
      {
        method: "POST",
        body: JSON.stringify({
          name: projectData.name,
          amount: projectData.budget,
          start_date: projectData.startDate,
          budget: projectData.budget,
          client: projectData.client,
          project_status: projectData.status,
          project_category: projectData.projectCategory,
          completion: projectData.progress,
          project_health: projectData.health,
          type: projectData.type,
          platform: projectData.platform,
          client_email: projectData.clientEmail,
          teamMembersCount: projectData.teamMembersCount,
          completion_date: projectData.endDate,
          description: projectData.projectDescription,
        }),
      }
    );

    // Return the response data
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to create project");
  }
}
