import { apiClient } from "@/lib/utils";

    export async function fetchKpiData(startDate, endDate,project) {
    try {
        if (startDate && endDate) {
        console.log("fetching data from", startDate, "to", endDate, "api");
        const response = await apiClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/finance_kpis/?start_date=${startDate}&end_date=${endDate}&project=${project}`
        );
        // Return the response data
        return { status: 200, data: response };
        } else {
        console.log("dates are not provided");
        const response = await apiClient(
            `${process.env.NEXT_PUBLIC_API_URL}/api/finance_kpis/`
        );
        // Return the response data
        return { status: 200, data: response };
        }
    } catch (error) {
        return {
        status: error.status || 500,
        message: error.message || "Failed to fetch dashboard KPI data",
        };
    }
    }
