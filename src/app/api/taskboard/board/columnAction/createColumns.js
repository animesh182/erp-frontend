import { apiClient } from "@/lib/utils";

export async function createColumns(columns) {
  const transformedData = {
    name: columns.name,
    board: columns.boardId,
  };

  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/board_lists/`,
      {
        method: "POST",
        body: JSON.stringify(transformedData),
      }
    );

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to create revenue");
  }
}