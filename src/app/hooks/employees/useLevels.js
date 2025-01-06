
import { getLevels } from "@/app/api/level/getLevels";
import { useQuery } from "@tanstack/react-query";


export const useLevels = () => {
    return useQuery({
    queryKey: ["levels"],
    queryFn: async () => {
        const response = await getLevels();
        if (response) {
        return response;
        }
    }
    });
}