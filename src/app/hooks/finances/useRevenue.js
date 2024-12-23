
import { getRevenue } from '@/app/api/revenue/getRevenue';
import { useQuery } from '@tanstack/react-query';

export const useRevenue = (startDate, endDate) => {
  return useQuery({
    queryKey: ["revenue", { startDate, endDate }],
    queryFn: async () => {
      const response = await getRevenue(startDate, endDate);
      return response;
    },
    select: (data) => {
      return data.map((revenue) => ({
        id: revenue.id,
        name: revenue.invoice?.name || "N/A",
        projectName: revenue.invoice?.project || "N/A",
        invoice: revenue.invoice?.invoice_no || "N/A",
        invoiceIssuedDate: revenue.invoice?.issued_date || null,
        paidDate: revenue.invoice?.payment_date || null,
        status: revenue.invoice?.payment_status || "N/A",
        type: revenue.invoice?.payment_type || "N/A",
        amount: revenue.invoice?.amount || "N/A",
        revenueType: revenue.revenue_type || "N/A",
      }));
    },
    enabled: !!startDate && !!endDate,
  });
};
