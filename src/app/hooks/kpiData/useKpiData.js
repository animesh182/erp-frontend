import { fetchKpiData } from '@/app/api/kpiData/fetchKpiData';
import { useQuery } from '@tanstack/react-query';

export const useKpi = (startDate, endDate, project) => {
  return useQuery({
    queryKey: ["kpi", { startDate, endDate, project }],
    queryFn: async () => {
      const response = await fetchKpiData(startDate, endDate, project);
      if (response.status === 200) {
        return response.data;
      } else {
        console.error(`Error: Received status ${response.status}`);
        throw new Error(`Failed to fetch KPI data: ${response.message || "Unknown error"}`);
      }
    },
    enabled: !!startDate && !!endDate,
    refetchOnWindowFocus: false,
  });
};
