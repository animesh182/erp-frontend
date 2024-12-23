
import { getRoles } from "@/app/api/role/getRoles";
import { useQuery } from "@tanstack/react-query";


export const useRoles = () => {
    return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
        const response = await getRoles();
        if (response) {
        return response;
        }
    }
    });
}