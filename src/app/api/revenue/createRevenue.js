import { apiClient } from "@/lib/utils";

export async function createRevenue(revenueData) {
  // Transform the revenueData structure
  const transformedData = {
    invoice: {
      name: revenueData.name,
      amount: parseFloat(revenueData.amount),
      ...(revenueData.paidDate && { payment_date: revenueData.paidDate }),
      ...(revenueData.projectName && { project: revenueData.projectName }),
      payment_status: revenueData.status,
      payment_type: revenueData.type,
      transaction_type: "Revenue",
      invoice_no: revenueData.invoice,
      issued_date: revenueData.invoiceIssuedDate,
    },
    revenue_type: revenueData.revenueType,
  };

  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/revenue/`,
      {
        method: "POST",
        body: JSON.stringify(transformedData),
      }
    );

    // Return the response data
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to create revenue");
  }
}
