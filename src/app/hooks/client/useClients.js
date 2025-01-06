import { getClients } from "@/app/api/projects/getClients";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useClients = () => {
    return useQuery({
    queryKey: ["client"],
    queryFn: async () => {
        const response = await getClients();
        if (response.status === 200) {
        return response.data;
        } else {
        throw new Error(response.message || "Failed to fetch client data");
        }
    },
    onSuccess: () => {
        toast.success("Client data fetched successfully");
    },
    onError: (error) => {
        toast.error(error.message || "Error fetching client data");
        console.error("Error fetching client data:", error);
    },
    });
};