import { apiClient } from "@/lib/utils";

export default async function fetchResourceUtil(startDate, endDate) {
  // console.log(startDate, endDate, "api");
  try {
    // Construct the URL conditionally based on the existence of startDate and endDate
    const url = `${
      process.env.NEXT_PUBLIC_API_URL
    }api/user_projects_utilization${
      startDate && endDate ? `?start_date=${startDate}&end_date=${endDate}` : ""
    }`;

    // Make the API call
    const response = await apiClient(url);
    // console.log(response);
    // Return the response with a success status
    return { status: 200, data: response };
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching resource utilization:", error);

    // Return a failure response with the appropriate error message and status
    return {
      status: error.status || 500,
      message:
        error.message ||
        "Failed to fetch resource utilization data in the dashboard",
    };
  }
}
