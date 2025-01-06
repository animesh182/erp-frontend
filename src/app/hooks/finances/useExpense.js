
import { getExpense } from '@/app/api/expense/getExpense';
import { useQuery } from '@tanstack/react-query';

export const useExpense = (startDate, endDate) => {
  return useQuery({
    queryKey: ["expense", { startDate, endDate }],
    queryFn: async () => {
      const response = await getExpense(startDate, endDate);
      return response;
    },
    select: (data) => {
      return data.map((expense) => ({
        id: expense.id,
      name: expense.invoice?.name || "N/A",
      projectName: expense.invoice?.project || "N/A",
      invoice: expense.invoice?.invoice_no || "N/A",
      invoiceIssuedDate: expense.invoice?.issued_date || null,
      paidDate: expense.invoice?.payment_date || null,
      status: expense.invoice?.payment_status || "N/A",
      type: expense.invoice?.payment_type || "N/A",
      amount: expense.invoice?.amount || "N/A",
      costType: expense.cost_type || "N/A",
      }));
    },
    enabled: !!startDate && !!endDate,
  });
};
