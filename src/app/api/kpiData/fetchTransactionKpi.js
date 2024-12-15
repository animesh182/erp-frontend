import { fetchKpiData } from "./fetchKpiData";



export async function fetchTransactionKpi(startDate, endDate) {
  try {
    // Call the existing fetchKpiData function to get the KPI data
    const response = await fetchKpiData(startDate, endDate,null);

    if (response.status === 200 && response.data) {
      const kpiData = response.data;

      // Extract the necessary fields
      const profit = kpiData.actual_profit;
      const expenses = kpiData.actual_cost;
      const revenue = kpiData.actual_revenue;
      const changeInProfit = kpiData.actual_profit_percentage_change;
      const changeInExpenses = kpiData.actual_cost_percentage_change;
      const changeInRevenue = kpiData.actual_revenue_percentage_change;

      // Return the extracted data
      return {
        status: 200,
        data: {
          profit,
          expenses,
          revenue,
          changeInProfit,
          changeInExpenses,
          changeInRevenue,
        },
      };
    } else {
      // Handle the case where the fetchKpiData function didn't return a successful response
      return {
        status: response.status,
        message: response.message || "Failed to fetch KPI data",
      };
    }
  } catch (error) {
    return {
      status: error.status || 500,
      message:
        error.message || "Failed to fetch profit, expense, and revenue data",
    };
  }
}
