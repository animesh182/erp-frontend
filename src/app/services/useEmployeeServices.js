import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeaveRequestStatus } from "../api/employees/approveLeaveRequest";
import { toast } from "sonner";
import { deleteLeaveRequestById } from "../api/employees/deleteLeaveRequest";
import { createEmployeeLeaveRequest } from "../api/employees/createEmployeeLeaveRequest";
import { createEmployee } from "../api/employees/createEmployee";
import { deleteEmployeeById } from "../api/employees/deleteEmployeeById";
import { editEmployee } from "../api/employees/editEmployee";

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

            

                export const useCreateEmployee=()=> {
                    // const queryClient = useQueryClient();
                    return useMutation({
                        mutationFn:({formData})=>createEmployee(formData),
                    
                    onSuccess: (data) => {
                        toast.success("Employee added successfully");
                        const newEmployee = {
                            id: data.id,
                            ...data, // Response data returned from API (like transformedData)
                            };
                            return newEmployee;
                            },
                            onError: (error) => {
                            // Handle error
                            toast.error(error.message || "Failed to add employee");
                            console.error("Error adding employee:", error);
                            },
                        }
                        );
                    }

                    
        export const useDeleteEmployee = () => {
            const queryClient = useQueryClient();
        
            return useMutation({
            mutationFn: (employeeId) => deleteEmployeeById(employeeId),
            onSuccess: () => {
                toast.success("Employee deleted successfully");
                queryClient.invalidateQueries({ 
                    queryKey: ['employees'],
                    refetchType: 'active',
                    exact: true 
                    });
                
                
            },
            onError: (error) => {
                toast.error("There was an error deleting employee");
                console.error("There was an error deleting employee:", error);
            }
            });
        };






            export const useEditEmployee = () => {
                return useMutation({
                mutationFn: async ({ employeeId, formData }) => {
                    const transformedData = {
                    employee_id: formData.employeeId,
                    full_name: formData.fullName,
                    email: formData.email,
                    salary: formData.salary,
                    employment_type: formData.employeeType,
                    role: formData.jobTitle,
                    country: formData.country,
                    phone_number: formData.phone,
                    pan_number: formData.panNumber,
                    supervisor: formData.supervisor,
                    start_date: formData.startDate,
                    end_date: formData.endDate || null,
                    level: formData.level,
                    gender: formData.gender,
                    marital_status: formData.maritalStatus,
                    linkedin_name: formData.linkedInName,
                    linkedin_url: formData.linkedInUrl,
                    date_of_birth: formData.dateOfBirth,
                    };
                    const response = await editEmployee(employeeId, transformedData);
            
                    return response;
                },
                onSuccess: (data) => {
                    toast.success('Employee updated successfully');
                    return data; 
                },
                onError: (error) => {
                    toast.error(error.message || 'Failed to edit employee information');
                    console.error('Error editing employee:', error);
                },
                });
            };