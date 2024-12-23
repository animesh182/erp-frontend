

import { getEmployeeLeaveRequest } from "@/app/api/employees/getEmployeeLeaveRequest";
import { getTypeOfLeave } from "@/app/api/typeOfLeave/getTypeOfLeave";
import { useQuery } from "@tanstack/react-query";

    export const useEmployeeLeaveRequest = () => {
        return useQuery({
        queryKey: ["employeeLeaveRequest"],
        queryFn: async () => {
            const response = await getEmployeeLeaveRequest();
            if (response.status && response.status !== 200) {
                console.error("Error fetching employee leave requests");
            throw new Error(response.message);
            }
            return response;
        },
        initialData:[]
        });
    };
    
    export const useTypeOfLeaves = () => {
        return useQuery({
        queryKey: ["typeOfLeaves"],
        queryFn: async () => {
            const response = await getTypeOfLeave();
            if (response.status && response.status !== 200) {
                console.error("Error fetching type of leave requests");
            throw new Error(response.message);
            }
            return response;
        },
        initialData:[]
        });
    };
    