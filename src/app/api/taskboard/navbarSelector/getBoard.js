import { apiClient } from "@/lib/utils";

// Function to fetch all board list
export async function getBoards() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/boards/`
    );
    return { status: 200, data: response.data };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch the boards details",
    };
  }
}