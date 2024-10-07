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
