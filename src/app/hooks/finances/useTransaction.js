import { getTransactions } from '@/app/api/transactions/getTransactions';
import { useQuery } from '@tanstack/react-query';

export const useTransaction = (startDate, endDate) => {
  return useQuery({
    queryKey: ["transaction", { startDate, endDate }],
    queryFn: async () => {
      const response = await getTransactions(startDate, endDate);
      return response;
    },
    select: (data) => {
      // Transform the fetched data here if needed
      return data.map((transaction) => ({
        id: transaction.id,
        name: transaction.name || "N/A",
        projectName: transaction.project || "N/A",
        invoice_no: transaction.invoice_no || "N/A",
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
    },
    enabled: !!startDate && !!endDate,
  });
};
