import { getEmployees } from '@/app/api/employees/getEmployees';
import { useQuery } from '@tanstack/react-query';

    export const useEmployees = (details=false) => {
        return useQuery({
            queryKey: ['employees'],
            queryFn: async () => {
            const response = await getEmployees();
            return response.data;
            },
            select: (data) => {
                if(details)
                    return data
                else
            return data.map((employee) => ({
                userId: employee.clockify_user_id,
                userName: employee.full_name,
                userEmail: employee.email, 
            }));
          
            },
            onError: (error) => {
            console.error("Error fetching employee details:", error); 
            },
        });
        };
