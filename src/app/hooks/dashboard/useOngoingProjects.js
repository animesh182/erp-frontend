
import { fetchOngoingProjects } from '@/app/api/dashboard/getFinancialStatus';
import { useQuery } from '@tanstack/react-query';

    export const useOngoingProjects = (startDate, endDate) => {
    return useQuery({
        queryKey: ["ongoingProjects", { startDate, endDate }],
        queryFn: async () => {
        const response = await fetchOngoingProjects(startDate, endDate);
        if (response.status === 200) {
            return {
                ongoingProjects: response.data.ongoing_projects,
                completedProjects: response.data.completed_projects,
            };
            } else {
            console.error("Failed to fetch ongoing projects data");
            throw new Error("Failed to fetch ongoing projects data");
            }
        },
        // enabled: !!startDate && !!endDate, // Only fetch if dates are provided
        });
    };