import { apiClient } from "@/lib/utils";

export async function getRevenue(startDate, endDate) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/revenue?start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
      }
    );

    // Format the fetched data to match the required format
    // const formattedData = response.map((revenue) => ({
    //   id: revenue.id,
    //   name: revenue.invoice?.name || "N/A",
    //   projectName: revenue.invoice?.project || "N/A",
    //   invoice: revenue.invoice?.invoice_no || "N/A",
    //   invoiceIssuedDate: revenue.invoice?.issued_date || null,
    //   paidDate: revenue.invoice?.payment_date || null,
    //   status: revenue.invoice?.payment_status || "N/A",
    //   type: revenue.invoice?.payment_type || "N/A",
    //   amount: revenue.invoice?.amount || "N/A",
    //   revenueType: revenue.revenue_type || "N/A",
    // }));

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch revenue");
  }
}
