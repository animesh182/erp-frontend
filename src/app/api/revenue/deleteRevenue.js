import { deleteApiClient } from "@/lib/utils";

export async function deleteRevenue(revenueId) {
  try {
    const result = await deleteApiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/revenue/${revenueId}`,
      {
        method: "DELETE",
      }
    );

    if (result === true) {
      return { success: true, message: "Revenue deleted successfully" };
    } else {
      throw new Error("Unexpected response from server");
    }
  } catch (error) {
    console.error("Error deleting revenue:", error);
    return {
      success: false,
      message: error.message || "Failed to delete revenue",
    };
  }
}
