import { apiClient } from "@/lib/utils";

export async function deleteRevenue(revenueId) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/revenue/${revenueId}`,
      {
        method: "DELETE",
      }
    );

    if (response.status === 204) {
      return "Revenue deleted successfully";
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error) {
    console.error("Error deleting revenue:", error);
    throw new Error(error.message || "Failed to delete revenue");
  }
}
