import { getEmployeeKpi } from "@/app/api/employees/getEmployeeKpi";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
        export const useEmployeeKpi = (userId) => {
            return useQuery({
                queryKey: ['employeeKpi', userId],
                queryFn: () => getEmployeeKpi(userId),
                enabled: !!userId,
            onError: (error) => {
                toast.error(error.message || "Error fetching employee kpi");
                console.error("Error fetching employee kpi:", error);
            },
            });
        };