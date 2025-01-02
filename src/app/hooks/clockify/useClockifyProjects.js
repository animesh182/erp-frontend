import { getClockifyProjectSummary } from '@/app/api/clockify/getClockifyProjects';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';


    export function useClockifyProjectSummary({ startDate, endDate }) {
        const queryClient=new QueryClient()
        const now = new Date();
        const start = new Date(startDate);
    const end = new Date(endDate);
    const oneYearInMs = 365 * 24 * 60 * 60 * 1000; // One year in milliseconds
    const isDateRangeValid = end - start <= oneYearInMs;
    const isStartDateValid = start <= now;
    if (!isDateRangeValid) {
        toast.error("Date range cannot exceed one year.");
        
    }
    if (!isStartDateValid) {
        toast.error("Start date cannot be in the future.");
    }
    return useQuery({
        queryKey: ["clockifyProjectSummary", startDate, endDate],
        queryFn: async () => {
            return await getClockifyProjectSummary(
                startDate,
                endDate
            );
        },
        enabled: !!startDate && !!endDate && isDateRangeValid && isStartDateValid,
        select: (data) => {
            // Perform sorting in React Query's `select` transformation
            if (data && data.groupOne) {
                const sortedProjects = data.groupOne.sort((a, b) => b.duration - a.duration);
                return {
                    ...data,
                    groupOne: sortedProjects,
                };
            }
            return data;
        },
        onError: (error) => {
            toast.error("Error fetching Clockify Projects Summary:", error);
        },
    
    });
    }


// export function useClockifyProjectSummary({ startDate, endDate }) {
//   return useQuery({
//       queryKey: ["clockifyProjectSummary", startDate, endDate],
//       queryFn: async () => {
//           return await getClockifyProjectSummary(startDate, endDate);
//       },
//       enabled: !!startDate && !!endDate,
//       select: (data) => {
//           // Perform sorting and transformation in the select function
//           if (data && data.groupOne) {
//               const sortedProjects = data.groupOne.sort((a, b) => b.duration - a.duration);
              
//               // Extract the `projects` and `projectColor` from the sorted data
//               const projects = sortedProjects.map((project) => ({
//                   projectName: project.name,
//                   projectDuration: project.duration,
//               }));

//               const projectColor = sortedProjects.map((project) => ({
//                   projectName: project.name,
//                   projectColor: project.color,
//               }));

//               return {
//                   projects,
//                   projectColor,
//               };
//           }
//           return {
//               projects: [],
//               projectColor: [],
//           };
//       },
//       onError: (error) => {
//           console.error("Error fetching project summary:", error);
//       },
//   });
// }