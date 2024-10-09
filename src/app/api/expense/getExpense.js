import { apiClient } from "@/lib/utils";

export async function getExpense(startDate, endDate) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/expense?start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
      }
    );

    // Format the fetched data to match the dummy data format
    const formattedData = response.map((expense) => ({
      name: expense.name,
      projectName: expense.projectName,
      invoice: expense.invoice,
      invoiceIssuedDate: expense.invoiceIssuedDate,
      paidDate: expense.paidDate,
      status: expense.status,
      type: expense.type,
      amount: expense.amount,
      costType: expense.costType,
    }));

    return formattedData;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch expenses");
  }
}
