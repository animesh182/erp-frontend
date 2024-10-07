import { updateEmployee } from "@/app/api/employee/getEmployees";
import { addExpense, deleteExpense, updateExpense } from "@/app/api/expense/getExpense";
import { updateInvoice } from "@/app/api/invoices/manageInvoices";
import { useExpense } from "@/hooks/useExpense";
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

  export const useUpdateExpenses = () => {
    const queryClient = useQueryClient();
    const { refetch } = useExpense(); 

    return useMutation({
        mutationFn: updateInvoice,
        onSuccess: (updatedExpense) => {
          
            queryClient.setQueryData(["expense"], (oldQueryData) => {
             
                const newData = oldQueryData.map((expense) =>
                    expense.id === updatedExpense.id ? updatedExpense : expense
                );
              
                return newData;
                
            });
            refetch();
        },
    });
};

export const useUpdateExpensesCostType = () => {
  const queryClient = useQueryClient();
  const { refetch } = useExpense(); 

  return useMutation({
      mutationFn: updateExpense,
      onSuccess: (updatedExpense) => {
        
          queryClient.setQueryData(["expenses"], (oldQueryData) => {
           
              const newData = oldQueryData.map((expense) =>
                  expense.id === updatedExpense.id ? updatedExpense : expense
              );
            
              return newData;
              
          });
          refetch();
      },
  });
};


export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: (deletedExpenseId) => {
      queryClient.setQueryData(["expense"], (oldExpenseData) => {
        return oldExpenseData.filter((expense) => expense.id !== deletedExpenseId);
      });
    },
  });
}