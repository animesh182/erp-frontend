import { apiClient } from "@/lib/utils";

export async function createClient(clientData) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/client/`,
      {
        method: "POST",
        body: JSON.stringify({
          name: clientData.name,
          email: clientData.email,
          website: clientData.website,
          phone_number: clientData.contactNumber,
        }),
      }
    );

    // Return the response data
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to create client");
  }
}
