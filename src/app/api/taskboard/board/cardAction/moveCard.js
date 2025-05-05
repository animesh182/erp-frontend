import { apiClient } from "@/lib/utils";

export async function updateCardPosition(movedCard) {
  const transformedData = {
    board_list_id: movedCard.board_list_id,
    position: movedCard.position,
  };
  const cardId = movedCard.cardId;

  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cards/${cardId}/move/`,
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
