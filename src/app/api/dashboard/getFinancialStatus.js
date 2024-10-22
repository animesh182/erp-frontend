import { apiClient } from "@/lib/utils";

export async function fetchOngoingProjects() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}api/ongoing_projects/`
    );
    // Return the response data
    return { status: 200, data: response };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch ongoing projects data",
    };
  }
}
