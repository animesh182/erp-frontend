import { apiClient } from "@/lib/utils";

export async function getExpense(startDate, endDate) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/expense?start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
      }
    );

    // Format the fetched data to match the required format
    const formattedData = response.map((expense) => ({
      id: expense.id,
      name: expense.invoice?.name || "N/A",
      projectName: expense.invoice?.project || "N/A",
      invoice: expense.invoice?.invoice_no || "N/A",
      invoiceIssuedDate: expense.invoice?.issued_date || null,
      paidDate: expense.invoice?.payment_date || null,
      status: expense.invoice?.payment_status || "N/A",
      type: expense.invoice?.payment_type || "N/A",
      amount: expense.invoice?.amount || "N/A",
      costType: expense.cost_type || "N/A",
    }));

    return formattedData;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch expenses");
  }
}
