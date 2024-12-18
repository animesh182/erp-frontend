import { apiClient } from "@/lib/utils";

export async function fetchOngoingProjects(startDate,endDate) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ongoing_projects/?start_date=${startDate}&end_date=${endDate}`
    );

    // Transform the response data
    const transformedData = {
      ongoing_projects: [],
      completed_projects: [],
    };
    response.forEach((project) => {
      if (project.project_completion) {
        transformedData.completed_projects.push(project);
      } else {
        transformedData.ongoing_projects.push(project);
      }
    });

    transformedData.ongoing_projects.sort(
      (a, b) => a.cost_exhausted_percentage - b.cost_exhausted_percentage
    );
    transformedData.completed_projects.sort(
      (a, b) => a.cost_exhausted_percentage - b.cost_exhausted_percentage
    );
    return { status: 200, data: transformedData };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch ongoing projects data",
    };
  }
}
