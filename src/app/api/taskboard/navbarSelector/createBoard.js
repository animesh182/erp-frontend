import { apiClient } from "@/lib/utils";

export async function createBoard(board) {
  const transformedData = {
    project_id: board.projectId,
    name: board.projectName,
  };

  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/boards/`,
      {
        method: "POST",
        body: JSON.stringify(transformedData),
      }
    );

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to create board");
  }
}
