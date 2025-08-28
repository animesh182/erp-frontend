import { apiClient } from "@/lib/utils";

export async function updateColumnPosition(movedColumn) {
  const transformedData = {
    position: movedColumn.position,
  };

  const id = movedColumn.columnId;

  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/board_lists/${id}/move/`,
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
