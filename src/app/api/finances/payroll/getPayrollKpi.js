import { apiClient } from "@/lib/utils";

export async function getPayrollKpi() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/payroll_kpis/`
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
