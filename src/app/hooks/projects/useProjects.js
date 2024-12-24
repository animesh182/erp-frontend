import { getProjectById, getProjectDetails, getProjects } from '@/app/api/projects/getProjects';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

    export const useProjects = (formData = false) => {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
        const response = await getProjects();
        if (response) {
            return response;
        } else {
            throw new Error(`Failed to fetch projects`);
        }
        },
        select: (data) => {
        if (formData) {
            return data.data.map((project) => ({
            id: project.id,
            name: project.name,
            }));
        }
        // Otherwise, return the raw data
        return data.data;
        },
    });
    };

        export const useProjectDetails = () => {
            return useQuery({
            queryKey: ["projects"],
            queryFn: async () => {
                const response = await getProjectDetails();
                if (response.status === 200) {
                return response.data;
                } else {
                throw new Error(response.message || "Failed to fetch project data");
                }
            },
            onSuccess: () => {
                toast.success("Project data fetched successfully");
            },
            onError: (error) => {
                toast.error(error.message || "Error fetching project details");
                console.error("Error fetching project details:", error);
            },
            });
        };

            export const useProjectById = (projectId) => {
                return useQuery({
                queryKey: ["project", projectId], // Include projectId in the key for uniqueness
                queryFn: async () => {
                    const response = await getProjectById(projectId);
                    if (response.status === 200) {
                    return response.data.data;
                    } else {
                    throw new Error(response.message || "Failed to fetch project data");
                    }
                },
                onError: (error) => {
                    toast.error(error.message || "Error fetching project details");
                    console.error("Error fetching project details:", error);
                },
                enabled: !!projectId, 
                });
            };