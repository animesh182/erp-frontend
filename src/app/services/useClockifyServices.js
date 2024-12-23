import { useMutation } from "@tanstack/react-query";
import { createTimeEntry, stopTimeEntry } from "../api/clockify/createTimeEntry";
import { toast } from "sonner";
    export const useCreateTimeEntry = () => {
    return useMutation({
        mutationFn: async ({ apiKey, timeEntry }) => {
        const response = await createTimeEntry(apiKey, timeEntry);

        if (!response || response.error) {
            console.error("Error creating time entry:", response.message);
            throw new Error(response.message || "Failed to create time entry");
        }

        return response;
        },
        onError: (error) => {
        console.error("Error creating time entry:", error.message);
        throw new Error(error.message || "Failed to create time entry");
        },
        // Optional: Add onSuccess or other handlers as needed
        onSuccess: (data) => {
        console.log("Time entry created successfully:", data);
        toast.success("Time entry created successfully!");
        },
    });
    };



