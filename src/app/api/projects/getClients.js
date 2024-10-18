// File: api/payroll.js
import { apiClient } from "@/lib/utils";

export async function getClients() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/client/`
    );
    return { status: 200, data: response };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch the client details",
    };
  }
}
