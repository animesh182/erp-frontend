import { updateInvoice } from "@/app/api/invoices/manageInvoices";
import { addRevenue, deleteRevenue, updateRevenue } from "@/app/api/revenue/getRevenue";
import { useRevenue } from "@/hooks/useRevenue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAddRevenue = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: addRevenue,
      onSuccess: (newData) => {

        queryClient.setQueryData(["revenue"], (oldRevenueData) => {
          if (!oldRevenueData) {
            return [newData];
          }
          console.log(oldRevenueData);
          return [...oldRevenueData, newData];
        });
      },
    });
  };
  

  export const useDeleteRevenue = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deleteRevenue,
      onSuccess: (deletedRevenueId) => {
        queryClient.setQueryData(["revenue"], (oldRevenueData) => {
          return oldRevenueData.filter((revenue) => revenue.id !== deletedRevenueId);
        });
      },
    });
  }

  export const useUpdateRevenue = () => {
    const queryClient = useQueryClient();
    const { refetch } = useRevenue(); 

    return useMutation({
        mutationFn: updateInvoice,
        onSuccess: (updatedRevenue) => {
          
            queryClient.setQueryData(["revenue"], (oldQueryData) => {
             
                const newData = oldQueryData.map((revenue) =>
                    revenue.id === updatedRevenue.id ? updatedRevenue : revenue
                );
              
                return newData;
                
            });
            refetch();
        },
    });
};
