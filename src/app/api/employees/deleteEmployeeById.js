import { deleteApiClient } from "@/lib/utils";

export async function deleteEmployeeById(userId) {
  try {
    const result = await deleteApiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
      {
        method: "DELETE",
      }
    );

    if (result === true) {
      return { success: true, message: "Employee deleted successfully" };
    } else {
      throw new Error("Unexpected response from server");
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    return {
      success: false,
      message: error.message || "Failed to delete employee",
    };
  }
}
