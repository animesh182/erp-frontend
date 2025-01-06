
import { getEmployeeProjects } from '@/app/api/employees/getEmployeeProjects';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useEmployeeProjects = (userId) => {
    return useQuery({
    queryKey: ["employeeProjects",userId],
    queryFn: async () => {
        const response = await getEmployeeProjects(userId);
        if (response.status === 200) {
        return response.data;
        } else {
        throw new Error(response.message || "Failed to fetch employee projects");
        }
    },
    enabled: !!userId,
    onError: (error) => {
        toast.error(error.message || "Error fetching employee projects");
        console.error("Error fetching employee projects:", error);
    },
    });
};