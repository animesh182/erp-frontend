import { deleteApiClient } from "@/lib/utils";

export async function deleteExpense(expenseId) {
  try {
    const result = await deleteApiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/expense/${expenseId}`,
      {
        method: "DELETE",
      }
    );

    if (result === true) {
      return { success: true, message: "Expense deleted successfully" };
    } else {
      throw new Error("Unexpected response from server");
    }
  } catch (error) {
    console.error("Error deleting expense:", error);
    return {
      success: false,
      message: error.message || "Failed to delete expense",
    };
  }
}
