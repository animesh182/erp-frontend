// File: api/payroll.js
import { apiClient } from "@/lib/utils";

export async function fetchPayroll(startDate, endDate) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoiced_salary?start=${startDate}&end=${endDate}`
    );
    return response; // Return the fetched data
  } catch (error) {
    console.error("Error fetching salary data:", error);
    throw new Error("Failed to fetch salary data");
  }
}
