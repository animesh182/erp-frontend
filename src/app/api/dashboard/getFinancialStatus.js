import { apiClient } from "@/lib/utils";

export async function fetchOngoingProjects() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}api/ongoing_projects/`
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

    // Return the transformed data
    return { status: 200, data: transformedData };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch ongoing projects data",
    };
  }
}
