import { apiClient } from "@/lib/utils";

export async function getLevels() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/levels`,
      {
        method: "GET",
      }
    );

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch levels");
  }
}
