
import { deletePayroll, generatePayroll, updatePayroll } from "@/app/api/payroll/getPayroll";
import { usePayroll } from "@/hooks/usePayroll";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGeneratePayroll = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: generatePayroll,
      onSuccess: (newData) => {
        queryClient.setQueryData(["payroll"], (oldPayrollData) => {
          if (!oldPayrollData) {
            return [newData];
          }
          return [...oldPayrollData, newData];
        });
        toast.success("Payroll uploaded successfully"); 
      },
      onError: (error) => {
        console.error("Upload failed:", error);
        toast.error("Failed to upload payroll sheet"); 
      },
    });
  };


  export const useUpdatePayroll = () => {
    const queryClient = useQueryClient();
    const { refetch } = usePayroll(); 
  
    return useMutation({
        mutationFn: updatePayroll,
        onSuccess: (updatedPayroll) => {
          
            queryClient.setQueryData(["payroll"], (oldQueryData) => {
             
                const newData = oldQueryData.map((payroll) =>
                    payroll.id === updatedPayroll.id ? updatedPayroll : payroll
                );
              
                return newData;
                
            });
            refetch();
        },
    });
  };
  

  export const useDeletePayroll = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deletePayroll,
      onSuccess: (deletedPayrollId) => {
        queryClient.setQueryData(["payroll"], (oldPayrollData) => {
          return oldPayrollData.filter((payroll) => payroll.id !== deletedPayrollId);
        });
      },
    });
  }