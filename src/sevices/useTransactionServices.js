
import { deleteTransaction, updateTransactions } from "@/app/api/transactions/getTransactions";
import { useTransactions } from "@/hooks/useTransactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    const { refetch } = useTransactions(); 

    return useMutation({
        mutationFn: updateTransactions,
        onSuccess: (updateTransaction) => {
          
            queryClient.setQueryData(["transactions"], (oldQueryData) => {
             
                const newData = oldQueryData.map((transaction) =>
                    transaction.id === updateTransaction.data.id ? updateTransaction.data : transaction
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
