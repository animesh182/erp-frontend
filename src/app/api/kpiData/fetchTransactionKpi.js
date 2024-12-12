import { fetchKpiData } from "./fetchKpiData";



export async function fetchTransactionKpi(startDate, endDate) {
  try {
    // Call the existing fetchKpiData function to get the KPI data
    const response = await fetchKpiData(startDate, endDate);

    if (response.status === 200 && response.data) {
      const kpiData = response.data;

      // Extract the necessary fields
      const profit = kpiData.total_profit_current_month;
      const expenses = kpiData.total_expenses_current_month;
      const revenue = kpiData.total_revenue_current_month;
      const changeInProfit = kpiData.percentage_change_in_profit;
      const changeInExpenses = kpiData.percentage_change_in_expenses;
      const changeInRevenue = kpiData.percentage_change_in_revenue;

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
