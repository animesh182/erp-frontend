// File: api/payroll.js
import { apiClient } from "@/lib/utils";

export async function getProjects() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/project/`
    );
    return { status: 200, data: response.data };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch the employee details",
    };
  }
}

export async function getProjectById(projectId) {
  try {
    // Call the API endpoint for the specific project
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/project/${projectId}`
    );
    return { status: 200, data: response };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || `Failed to fetch project with ID ${projectId}`,
    };
  }
}


export async function getUserProjectById(projectId) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user_projects/?project_id=${projectId}`
    );

    // Return the response directly since it's not wrapped in a `data` field
    return { status: 200, data: response };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || `Failed to fetch project with ID ${projectId}`,
    };
  }
}
