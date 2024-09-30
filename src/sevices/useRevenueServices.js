import { addRevenue, deleteRevenue, updateRevenue } from "@/app/api/revenue/getRevenue";
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
  

  export const useDeletePost = () => {
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
    return useMutation({
      mutationFn: updateRevenue,
      onSuccess: (updatedRevenue) => {
        queryClient.setQueryData(["revenue"], (oldRevenueData) => {
          return oldRevenueData.map((revenue) =>
            revenue.id === updatedRevenue.id ? updatedRevenue : revenue
          );
        });
      },
    });
  };