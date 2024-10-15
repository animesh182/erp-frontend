import { apiClient } from "@/lib/utils";

export async function deleteExpense(expenseId) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/expense/${expenseId}`,
      {
        method: "DELETE",
      }
    );

    if (response.status === 204) {
      return "Expense deleted successfully";
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw new Error(error.message || "Failed to delete expense");
  }
}
