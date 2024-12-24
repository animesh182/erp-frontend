import { apiClient } from "@/lib/utils";

export async function assignProject(employeeId, projectData) {
  //   console.log(projectData, "projectData");

  // Transform the projectData structure if needed
  // const transformedData = {
  //   project_id: projectData.projectName,
  //   project_role: projectData.role,
  //   utilization: projectData.timeAllocatedPerDay,
  //   start_date: projectData.startDate,
  //   end_date: projectData.endDate,
  //   // Add any other fields that the API expects
  // };

  try {
    // console.log(transformedData, "transformedData");
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user_projects/?user_id=${employeeId}`,
      {
        method: "POST",
        body: JSON.stringify(projectData),
      }
    );

    // Return the response data
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to assign project to employee");
  }
}
