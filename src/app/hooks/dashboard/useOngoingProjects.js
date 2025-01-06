
import { fetchOngoingProjects } from '@/app/api/dashboard/getFinancialStatus';
import { useQuery, useQueryClient } from '@tanstack/react-query';

    export const useOngoingProjects = (startDate, endDate) => {
        const queryClient = useQueryClient();
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
            //for animation instead of loading
            // placeholderData: (previousData) => {
            //     const currentData = queryClient.getQueryData(["ongoingProjects", { startDate, endDate }]);
            //     return currentData || previousData || {
            //     ongoingProjects: [],
            //     completedProjects: []
            //     };
            // },
            keepPreviousData: true,
            });
        };