import { getClockifyProjectSummary } from '@/app/api/clockify/getClockifyProjects';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';


export function useClockifyProjectSummary({ startDate, endDate }) {
  return useQuery({
      queryKey: ["clockifyProjectSummary", startDate, endDate],
      queryFn: async () => {
          return await getClockifyProjectSummary(
              startDate,
              endDate
          );
      },
      enabled: !!startDate && !!endDate,
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