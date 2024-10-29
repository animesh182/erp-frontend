import { apiClient } from "@/lib/utils";

export async function getProjects(formatData = false) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/project`,
      {
        method: "GET",
      }
    );

    if (formatData) {
      // Format the fetched data to match the required format
      const formattedData = response.data.map((project) => ({
        id: project.id,
        name: project.name,
      }));
      return formattedData;
    }

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch projects");
  }
}
