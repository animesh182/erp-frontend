import { addExpense } from "@/app/api/expense/getExpense";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: addExpense,
      onSuccess: (newData) => {
    
        queryClient.setQueryData(["expenses"], (oldExpenseData) => {
          if (!oldExpenseData) {
            return [newData];
          }
          return [...oldExpenseData, newData];
        });
      },
    });
  };