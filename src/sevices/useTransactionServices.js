
import { updateInvoice } from "@/app/api/invoices/manageInvoices";
import { deleteTransaction } from "@/app/api/transactions/getTransactions";
import { useTransactions } from "@/hooks/useTransactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();
    const { refetch } = useTransactions(); 

    return useMutation({
      mutationFn: updateInvoice,
        onSuccess: (updateTransaction) => {
          
            queryClient.setQueryData(["transactions"], (oldQueryData) => {
             
                const newData = oldQueryData.map((transaction) =>
                    transaction.id === updateTransaction.id ? updateTransaction : transaction
                );
              
                return newData;
                
            });
            refetch();
        },
    });
};





export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deleteTransaction,
      onSuccess: (deletedTransactionId) => {
        queryClient.setQueryData(["transactions"], (oldTransactionData) => {
          return oldTransactionData.filter((transaction) => transaction.id !== deletedTransactionId);
        });
      },
    });
  }
