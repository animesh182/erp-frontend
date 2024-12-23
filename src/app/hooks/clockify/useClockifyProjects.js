import { getClockifyProjectSummary } from '@/app/api/clockify/getClockifyProjects';
import { useQuery } from '@tanstack/react-query';

export const useClockifyProjectSummary = (startDate, endDate) => {
  return useQuery({
    queryKey: ["clockifyProjectSummary", { startDate, endDate }],
    queryFn: () => getClockifyProjectSummary(startDate, endDate),
    enabled: !!startDate && !!endDate,
    select: (data) => {
      if (!data?.groupOne) return { projects: [], projectColor: [] };

      const sortedProjects = data.groupOne
        .sort((a, b) => b.duration - a.duration)
        .map((project) => ({
          projectName: project.name,
          projectColor: project.color,
          duration: project.duration, // Include duration for chart
        }));

      return {
        projects: sortedProjects,
        projectColor: sortedProjects.map(({ projectName, projectColor }) => ({ projectName, projectColor })),
      };
    },
  });
};
