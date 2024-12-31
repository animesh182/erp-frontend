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

        export const useProjectDetails = (startDate,endDate) => {
            return useQuery({
            queryKey: ["projects",{startDate,endDate}],
            queryFn: async () => {
                const response = await getProjectDetails(startDate,endDate);
                if (response.status === 200) {
                    console.log(response.data,"res")
                return response?.data
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


            // export const useProjectDetails = () => {
            //     return useQuery({
            //     queryKey: ["projects"],
            //     queryFn: async () => {
            //         const response = await getProjectDetails();
            //         if (response.status === 200) {
            //         // Map project_status to readable strings
            //         const transformedData = response.data.map((project) => ({
            //             ...project,
            //             project_status:
            //             project.project_status === 1
            //                 ? "Done"
            //                 : project.project_status === 2
            //                 ? "Ongoing"
            //                 : "Not Started",
            //         }));
            //         console.log(transformedData, "transformed projects");
            //         return transformedData;
            //         } else {
            //         throw new Error(response.message || "Failed to fetch project data");
            //         }
            //     },
            //     onSuccess: () => {
            //         toast.success("Project data fetched successfully");
            //     },
            //     onError: (error) => {
            //         toast.error(error.message || "Error fetching project details");
            //         console.error("Error fetching project details:", error);
            //     },
            //     });
            // };
            
        export const useProjectById = (id,startDate,endDate) => {
            return useQuery({
            queryKey: ["projectById",{id,startDate,endDate}],
            queryFn: async () => {
                const response = await getProjectById(id,startDate,endDate);
                if (response.status === 200) {
                return response.data.data;
                } else {
                throw new Error(response.message || "Failed to fetch project data");
                }
            },
            enabled: !!id,
            onError: (error) => {
                toast.error(error.message || "Error fetching project By Id");
                console.error("Error fetching project by id:", error);
            },
            });
        };