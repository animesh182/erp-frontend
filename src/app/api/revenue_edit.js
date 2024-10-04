import { apiClient } from "@/lib/utils";
import { format } from "date-fns";
export async function updateInvoice(id, updatedInvoiceData) {
  try {
    console.log("Updating invoice with ID:", id); // Log the invoice ID
    console.log("Updated invoice data:", updatedInvoiceData); // Log the payload being sent

    // Format the payment_date to YYYY-MM-DD format, if the status is "paid"
    const formattedPaidDate =
      updatedInvoiceData.status === 2
        ? format(new Date(updatedInvoiceData.paidDate), "yyyy-MM-dd")
        : null; // If not paid, omit the paid date

    // Construct the payload conditionally
    const payload = {
      name: updatedInvoiceData.name,
      payment_date: format(new Date(updatedInvoiceData.paidDate), "yyyy-MM-dd"), // Assuming this is the issued date
      client: updatedInvoiceData.client,
      amount: updatedInvoiceData.amount,
      project_id: updatedInvoiceData.project_id,
      payment_status: updatedInvoiceData.status, // Status should always be passed
      payment_type: updatedInvoiceData.payment_type,
      transaction_type: "Revenue", // Assuming this is always "Revenue"
    };

    if (formattedPaidDate) {
      payload.paid_date = formattedPaidDate;
    }

    console.log("Final Payload:", payload); // Log the final payload being sent

    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server responded with an error:", errorData); // Log any errors from the server
      throw new Error(errorData.message || "Failed to update invoice");
    }

    return await response.json(); // Return the updated invoice data
  } catch (error) {
    console.error("Failed to update invoice:", error.message); // Log any errors
    throw new Error("Failed to update invoice");
  }
}
