import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeaveRequestStatus } from "../api/employees/approveLeaveRequest";
import { toast } from "sonner";
import { deleteLeaveRequestById } from "../api/employees/deleteLeaveRequest";
import { createEmployeeLeaveRequest } from "../api/employees/createEmployeeLeaveRequest";

export const useUpdateLeaveRequestStatus = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        // Remove queryKey from here as it's not needed in mutation options
        mutationFn: async ({ id, newStatus }) => {
            const response = await updateLeaveRequestStatus(newStatus, id);
            return response;
        },
        onSuccess: (data, { id, newStatus }) => {
            toast.success("Leave request updated successfully.");
            // Invalidate all related queries
            queryClient.invalidateQueries({
                queryKey: ["employeeLeaveRequest"],
                exact: false, // This will invalidate all queries that start with employeeLeaveRequest
                refetchActive: true // Force an immediate refetch
            });
        },
        onError: (error) => {
            toast.error("Failed to update leave request.");
            console.error(error);
        },
    });
};


    // export const useDeleteLeaveRequest=()=> {
    //     return useMutation((leaveRequestId) => deleteLeaveRequestById(leaveRequestId),
    //     {
    //         onSuccess: () => {
    //         toast.success("Leave request deleted successfully");
    //         },
    //         onError: (error) => {
    //         toast.error("There was an error deleting the leave request");
    //         console.error("Error deleting leave request:", error);
    //         },
    //     }
    //     );
    // }

        export const useDeleteLeaveRequest = () => {
            const queryClient = useQueryClient();
        
            return useMutation({
            mutationFn: (leaveRequestId) => deleteLeaveRequestById(leaveRequestId),
            onSuccess: () => {
                toast.success("Leave request deleted successfully");
                queryClient.invalidateQueries({ 
                    queryKey: ['employeeLeaveRequest'],
                    refetchType: 'active',
                    exact: true 
                    });
                
                
            },
            onError: (error) => {
                toast.error("There was an error deleting the leave request");
                console.error("There was an error deleting the leave request:", error);
            }
            });
        };



            export const useAddLeaveRequest = () => {
                const queryClient = useQueryClient();
            
                return useMutation({
                mutationFn: ({ formData, userId }) => 
                    createEmployeeLeaveRequest(formData, userId),
                onSuccess: () => {
                    toast.success("Leave Request added successfully");
                    queryClient.invalidateQueries({ queryKey: ['employeeLeaveRequest'] });
                },
                onError: (error) => {
                    toast.error("Failed to create leave request");
                    console.error("Error creating leave request:", error.message);
                }
                });
            };