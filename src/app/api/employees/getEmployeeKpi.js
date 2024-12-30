import { apiClient } from "@/lib/utils";

export async function getEmployeeKpi(userId) {
    try {
      const response = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user_dashboard_kpis/${userId}/`
      );
      console.log(response,"resres")
      return  response;
    } catch (error) {
      return {
        status: error.status || 500,
        message: error.message || "Failed to fetch the employee kpi data",
      };
    }
  }