import { useMutation } from "@tanstack/react-query";
import { createProject } from "../api/projects/createProject";
import { toast } from "sonner";
import { editProject } from "../api/projects/editProject";
import { deleteProject } from "../api/projects/deleteProject";

export const useCreateProject=()=> {
    return useMutation({
        mutationFn:({formData})=>createProject(formData),
    
    onSuccess: () => {
        toast.success("Project created successfully");
            },
            onError: (error) => {
            toast.error(error.message || "Failed to create new project");
            console.error("Error creating new project:", error);
            },
        }
        );
    }

export const useEditProject=()=> {
    return useMutation({
        mutationFn:({projectId,formData})=>editProject(projectId,formData),
    
    onSuccess: () => {
        toast.success("Project updated successfully");
            },
            onError: (error) => {
            toast.error(error.message || "Failed to update the project");
            console.error("Error updating the project:", error);
            },
        }
        );
    }


    export const useDeleteProject = () => {
        
            return useMutation({
            mutationFn: (projectId) => deleteProject(projectId),
            onSuccess: () => {
                toast.success("Project deleted successfully");            
            },
            onError: (error) => {
                toast.error("There was an error deleting project");
                console.error("There was an error deleting project:", error);
            }
            });
        };