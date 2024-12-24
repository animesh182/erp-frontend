import { toast } from "sonner";
import { createClient } from "../api/projects/createClient";
import { useMutation } from "@tanstack/react-query";

export const useCreateClient=()=> {
    return useMutation({
        mutationFn: (clientData) => createClient(clientData), 
    
    onSuccess: () => {
        toast.success("Client added successfully");
            },
            onError: (error) => {
                toast.error("There was an error adding the client");
                console.error("Error adding client:", error);
            },
        }
        );
    }