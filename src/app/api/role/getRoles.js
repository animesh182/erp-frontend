import { apiClient } from "@/lib/utils";

export async function getRoles() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/roles`,
      {
        method: "GET",
      }
    );

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch roles");
  }
}
