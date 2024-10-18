import { apiClient } from "@/lib/utils";

export async function fetchExpenses(startDate, endDate) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoices?start=${startDate}&end=${endDate}`
    );
    return response; // Return the fetched data
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw new Error("Failed to fetch invoices");
  }
}
