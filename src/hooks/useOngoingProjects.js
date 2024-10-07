import { getOngoingProjects } from "@/app/api/projects/getOngoingProjects";
import { getProjects } from "@/app/api/projects/getProjects";
import { useQuery } from "@tanstack/react-query";

export const useOngoingProjects=()=>useQuery({
    queryKey:["ongoingProjects"],
    queryFn:getOngoingProjects,
    select: (data) => {
      return data.map((project) => {

        return {
          project: project.project_name || "N/A",
          totalIncome: Number(project.total_revenue) || "N/A",
          expenses:Number(project.total_cost) || "N/A",
        //   isRecurring: project.type==="fixed"?  false: true, 
          completed: parseInt(project.completion_percentage)===100?true:false 
      
        };
      });
    },
  });

