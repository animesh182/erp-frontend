import { apiClient } from "@/lib/utils";

export default async function fetchResourceUtil(startDate, endDate,project) {
  // console.log(startDate, endDate, "api");
  try {
    const response = await apiClient(
       `${process.env.NEXT_PUBLIC_API_URL}/api/user_projects_utilization/?start_date=${startDate}&end_date=${endDate}&project=${project}`
    );
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
