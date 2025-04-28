import { apiClient } from "@/lib/utils";

export async function moveColumns(boardId, position) {

    const transformedData = {
        position : position
    }

  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/board_lists/${boardId}/move/`,
      {
        method: "PATCH",
        body: JSON.stringify(transformedData),
      }
    );

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to move columns");
  }
}
