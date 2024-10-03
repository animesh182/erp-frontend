// File: api/invoices.js

import { apiClient } from "@/lib/utils";

export async function addInvoice(newInvoiceData) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newInvoiceData.name,
          payment_date: newInvoiceData.paidDate,
          client: newInvoiceData.client || 1, // Set default client to 1 if not provided
          amount: newInvoiceData.amount,
          project_id: newInvoiceData.project_id, // Assuming this is project_id from the data
          payment_status: newInvoiceData.status === "paid" ? 2 : 1, // Status mapping
          payment_type: newInvoiceData.payment_type || 1, // Default payment type to 1 if not provided
          transaction_type: "Revenue", // Assuming all additions are "Revenue"
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add invoice");
    }

    // Return the parsed JSON response
    return await response.json();
  } catch (error) {
    console.error("Error adding invoice:", error.message);
    throw new Error("Failed to add new revenue data");
  }
}
