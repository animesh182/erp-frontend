
import { getTimeEntryById } from '@/app/api/clockify/getTimeEntryById';
import { useQuery } from '@tanstack/react-query';

export const useTimeEntryById = (id) => {
  return useQuery({
    queryKey: ["timeEntryById", {id }],
    queryFn: async () => {
      const response = await getTimeEntryById(id);
      if (response) {
        return response;
      } else {
        console.error(`Error: Received status ${response.status}`);
        throw new Error(`Failed to fetch KPI data: ${response.message || "Unknown error"}`);
      }
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};
