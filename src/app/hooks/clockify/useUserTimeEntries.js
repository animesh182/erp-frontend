import { fetchTimeEntries } from "@/app/api/clockify/getUserTimeEntries";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

        export const useUserTimeEntries = (userData, clockifyDate) => {
            return useQuery({
            queryKey: ['userTimeEntries', userData, clockifyDate],
            queryFn: () => fetchTimeEntries(userData, clockifyDate),
            enabled: !!userData.email && !!userData.name,
            select: (data) => {
                if (!data) return [];
                
                return data.map((entry) => ({
                timeInterval: entry.timeInterval,
                description: entry.description,
                projectId: entry.projectId,
                }));
            },
            onError: (error) => {
                console.error("Error fetching Clockify data:", error);
                toast.error("Failed to fetch time entries");
            }
            });
        };
