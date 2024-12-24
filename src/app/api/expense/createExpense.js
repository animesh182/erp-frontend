import { apiClient } from "@/lib/utils";

export async function createExpense(expenseData) {

  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/expense/`,
      {
        method: "POST",
        body: JSON.stringify(expenseData),
      }
    );

    // Return the response data
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to create expense");
  }
}
