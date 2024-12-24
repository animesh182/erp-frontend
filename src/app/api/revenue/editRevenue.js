import { apiClient } from "@/lib/utils";

export async function editRevenue(revenueId, revenueData) {

  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/revenue/${revenueId}/`,
      {
        method: "PATCH",
        body: JSON.stringify(revenueData),
      }
    );

    // Return the response data
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to edit revenue");
  }
}
