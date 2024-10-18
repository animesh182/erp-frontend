import { apiClient } from "@/lib/utils";
import { fetchExpenses } from "../../expenses";
import { fetchInvoices } from "../../invoice";

// Function to fetch all transactions (invoices and expenses)
export async function fetchAllTransactions(startDate, endDate) {
  try {
    // Fetch both invoices and expenses concurrently
    const [invoices, expenses] = await Promise.all([
      fetchInvoices(startDate, endDate),
      fetchExpenses(startDate, endDate),
    ]);

    // Add a "type" property to differentiate between revenue and expenses
    const combinedTransactions = [
      ...invoices.map((invoice) => ({ ...invoice, isExpense: false })),
      ...expenses.map((expense) => ({ ...expense, isExpense: true })),
    ];

    // Return the combined list
    return {
      status: 200,
      data: combinedTransactions,
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);

    // Return an error status code 500 in case of failure
    return {
      status: 500,
      data: [],
      message: "Failed to fetch transactions",
    };
  }
}
