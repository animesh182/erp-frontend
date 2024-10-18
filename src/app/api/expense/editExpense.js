import { apiClient } from "@/lib/utils";

export async function editExpense(expenseId, expenseData) {
  // Transform the expenseData structure
  const transformedData = {
    invoice: {
      name: expenseData.name,
      amount: parseFloat(expenseData.amount),
      payment_date: expenseData.invoiceIssuedDate,
      ...(expenseData.projectName && expenseData.projectName !== "N/A"
        ? { project: expenseData.projectName }
        : {}),
      payment_status: expenseData.status,
      payment_type: expenseData.type,
      transaction_type: "Expense",
      invoice_no: expenseData.invoice,
    },
    cost_type: expenseData.costType.replace("-", " "),
  };

  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/expense/${expenseId}/`,
      {
        method: "PATCH",
        body: JSON.stringify(transformedData),
      }
    );

    // Return the response data
    return response;
  } catch (error) {
    console.error("Error editing expense:", error);
    throw new Error(error.message || "Failed to edit expense");
  }
}
