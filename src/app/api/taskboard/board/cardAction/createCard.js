import { apiClient } from "@/lib/utils";

export async function createCard(card) {
  const transformedData = {
    title: card.title,
    board_list: card.board_list,
  };

  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cards/`,
      {
        method: "POST",
        body: JSON.stringify(transformedData),
      }
    );

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to create card");
  }
}
