import { apiClient } from "@/lib/utils";

export async function renameColumn(columns) {
  const transformedData = {
    name: columns.name,
  };
  const id = columns.columnId;

  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/board_lists/${id}/`,
      {
        method: "PATCH",
        body: JSON.stringify(transformedData),
      }
    );

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to rename");
  }
}
