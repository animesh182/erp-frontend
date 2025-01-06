import fetchResourceUtil from '@/app/api/dashboard/fetchResourceUtil';
import { useQuery } from '@tanstack/react-query';

    export const useResourceUtil = (startDate, endDate, project) => {
    return useQuery({
        queryKey: ["resourceUtil", { startDate, endDate, project }],
        queryFn: async () => {
        const response = await fetchResourceUtil(startDate, endDate, project);
        if (response.status === 200) {
            return response.data; // Return raw data
        } else {
            console.error(`Error: Received status ${response.status}`);
            throw new Error(`Failed to fetch resource utilization data: ${response.message || "Unknown error"}`);
        }
        },
        enabled: !!startDate && !!endDate,
        select: (data) =>
        data.map((user) => {
            const userProjects = {};
            user.projects.forEach((project) => {
            userProjects[project.project_name] = project.utilization;
            });
            return {
            name: user.user_name || "Unknown",
            ...userProjects,
            };
        }),
    });
    };
