import { apiClient } from "@/lib/utils";

export async function getTransactions(startDate, endDate) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoices?start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
      }
    );
    console.log(response, "transactions");
    // Format the fetched data to match the required format
    const formattedData = response.map((transaction) => ({
      id: transaction.id,
      name: transaction.name || "N/A",
      projectName: transaction.project || "N/A",
      invoice: transaction.invoice_no || "N/A",
      invoiceIssuedDate: transaction.issued_date || null,
      paidDate: transaction.payment_date || null,
      status: transaction.payment_status || "N/A",
      type: transaction.payment_type || "N/A",
      amount: transaction.amount || "N/A",
      transactionType: transaction.transaction_type || "N/A",
      payment: transaction.payment || "0.00",
      currency: transaction.currency || null,
      createdAt: transaction.created_at || null,
    }));

    return formattedData;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch transactions");
  }
}
