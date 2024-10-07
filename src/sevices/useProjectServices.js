
import { deleteProject, updateProjects } from "@/app/api/projects/getProjects";
import { useProjects } from "@/hooks/useProjects";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    const { refetch } = useProjects(); 

    return useMutation({
        mutationFn: updateProjects,
        onSuccess: (updatedProject) => {
          
            queryClient.setQueryData(["projects"], (oldQueryData) => {
             
                const newData = oldQueryData.map((project) =>
                    project.id === updatedProject.data.id ? updatedProject.data : project
                );
              
                return newData;
                
            });
            refetch();
        },
    });
};



export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deleteProject,
      onSuccess: (deletedProjectId) => {
        queryClient.setQueryData(["projects"], (oldProjectsData) => {
          return oldProjectsData.filter((project) => project.id !== deletedProjectId);
        });
      },
    });
  }


 