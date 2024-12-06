import { apiClient } from "@/lib/utils";
import { getYear } from "date-fns";
export async function fetchProfitLoss(project,selectedYear= getYear(new Date())) {
  // const currentYear = getYear(new Date());
  try {
    const response = await apiClient(
      // `${process.env.NEXT_PUBLIC_API_URL}api/profit_loss_report/?year=${currentYear}`
      `${process.env.NEXT_PUBLIC_API_URL}api/profit_loss_report/?year=${selectedYear}&project=${project}`
    );
    // Return the response data
    return { status: 200, data: response };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch dashboard KPI data",
    };
  }
}
