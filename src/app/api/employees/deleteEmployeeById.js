import { apiClient } from "@/lib/utils";

export async function deleteEmployeeById(userId) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}api/users/${userId}/`,
      {
        method: "DELETE",
      }
    );
    console.log(response);
    return { status: 200, data: response.data };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to delete the employee details",
    };
  }
}
