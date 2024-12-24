import { apiClient } from "@/lib/utils";

export async function editExpense(expenseId, expenseData) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/expense/${expenseId}/`,
      {
        method: "PATCH",
        body: JSON.stringify(expenseData),
      }
    );

    // Return the response data
    return response;
  } catch (error) {
    console.error("Error editing expense:", error);
    throw new Error(error.message || "Failed to edit expense");
  }
}
