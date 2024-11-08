import { apiClient } from "@/lib/utils";

export async function editAssignedProject(userProjectId, projectData) {
  console.log(userProjectId, "userProjectId");
  // Transform the projectData structure if needed
  const transformedData = {
    project_id: projectData.projectName,
    project_role: projectData.role,
    utilization: projectData.timeAllocatedPerDay,
    start_date: projectData.startDate,
    end_date: projectData.endDate,
    // Add any other fields that the API expects
  };

  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user_projects/patch/?id=${userProjectId}`,
      {
        method: "PATCH",
        body: JSON.stringify(transformedData),
      }
    );

    // Return the response data
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to assign project to employee");
  }
}
