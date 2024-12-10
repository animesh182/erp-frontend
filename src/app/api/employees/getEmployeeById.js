import { apiClient } from "@/lib/utils";


export async function getEmployeeById(userId) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/employee-details/${userId}`
    );
    return { status: 200, data: response.data };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch the employee detail",
    };
  }
}