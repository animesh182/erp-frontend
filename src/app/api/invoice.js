// File: revenue_edit.js
import { apiClient } from "@/lib/utils"; // Adjust the path according to your project structure

export async function fetchInvoices(startDate, endDate) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/?start=${startDate}&end=${endDate}`,
      {
        method: "GET",
      }
    );
    return response; // Return the fetched invoices data
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw new Error("Failed to fetch invoices");
  }
}
