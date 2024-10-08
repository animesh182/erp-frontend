
import { addClient } from "@/app/api/client/getClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useAddClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: addClient,
      onSuccess: (updatedClient) => {

        queryClient.setQueryData(["client"], (oldQueryData) => {
          if (!oldQueryData) {
            return [updatedClient];
          }
          console.log(oldQueryData);
          return [...oldQueryData, updatedClient];
        });
      },
    });
  };
  