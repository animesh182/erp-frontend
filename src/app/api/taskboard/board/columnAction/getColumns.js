import { apiClient } from "@/lib/utils";

// Function to fetch all board list
export async function getColumns(id) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/board_lists/?board_id=${id}`
    );
    return { status: 200, data: response };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch the Columns details",
    };
  }
}
