// File: api/salary.js
import { apiClient } from "@/lib/utils";

export async function updatePayroll(id, updatedData) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoiced_salary/${id}/`, // Use the appropriate API endpoint and method
      {
        method: "PUT", // Use PUT or PATCH depending on the API spec
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData), // Send the edited data
      }
    );
    return response; // Return the updated data from the server
  } catch (error) {
    console.error("Failed to update salary:", error);
    throw new Error("Failed to update salary");
  }
}
