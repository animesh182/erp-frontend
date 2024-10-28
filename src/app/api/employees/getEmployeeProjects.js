import { apiClient } from "@/lib/utils";


export async function getEmployeeProjects(userId) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user_projects/${userId}/`
    );
    return { status: 200, data: response.data };
    // return response;
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch the employee projects",
    };
  }
}