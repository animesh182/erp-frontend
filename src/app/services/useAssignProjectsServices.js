import { useMutation } from "@tanstack/react-query";
import { assignProject } from "../api/employees/assignProject";
import { toast } from "sonner";
import { editAssignedProject } from "../api/employees/editAssignedProject";
import { deleteAssignedProject } from "../api/employees/deleteAssignedProject";


    export function useAssignProject() {
        return useMutation({
        mutationFn: async ({ employeeId, projectData }) => {
            const transformedData = {
            project_id: projectData.projectName,
            project_role: projectData.role,
            utilization: projectData.timeAllocatedPerDay,
            start_date: projectData.startDate,
            end_date: projectData.endDate,
            };
            const response = await assignProject(employeeId, transformedData);
            if (!response || response.error) {
            console.error('Error assigning project:', response.message);
            throw new Error(response.message || 'Failed to assign project');
            }
    
            return response;
        },
        onError: (error) => {
            console.error('Failed to assign project:', error.message);
            toast.error(error.message || 'Failed to assign project');
        },
        onSuccess: (data) => {
            console.log('Project assigned successfully:', data);
            toast.success('Project assigned successfully');
        },
        });
    }
    export function useEditAssignedProjects() {
        return useMutation({
        mutationFn: async ({ userProjectId, projectData }) => {
            const transformedData = {
                project_id: projectData.projectName,
                project_role: projectData.role,
                utilization: projectData.timeAllocatedPerDay,
                start_date: projectData.startDate,
                end_date: projectData.endDate,
            };
            const response = await editAssignedProject(userProjectId, transformedData);
            if (!response || response.error) {
            console.error('Error editing assigned project:', response.message);
            throw new Error(response.message || 'Failed to edit assigned project');
            }
    
            return response;
        },
        onError: (error) => {
            console.error('Failed to edit assigned project:', error.message);
            toast.error(error.message || 'Failed to edit assigned project');
        },
        onSuccess: (data) => {
            console.log('Assigned project edited successfully:', data);
            toast.success('Assigned project edited successfully');
        },
        });
    }



    export const useDeleteAssignedProject = () => {
    
        return useMutation({
        mutationFn: (userProjectId) => deleteAssignedProject(userProjectId),
        onSuccess: () => {
            toast.success("Assigned project deleted successfully");            
        },
        onError: (error) => {
            toast.error("There was an error deleting assigned project");
            console.error("There was an error deleting assigned project:", error);
        }
        });
    };
