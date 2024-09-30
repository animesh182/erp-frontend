import { getEmployeeUtlization } from "@/app/api/employee/getEmployeeUtilization";
import { useQuery } from "@tanstack/react-query";


export const useEmployeeUtilization=()=>useQuery({
    queryKey:["utilization"],
    queryFn:getEmployeeUtlization,
    select:(data)=>{
        return data.map(item=>{
            const projects = item.projects.reduce((acc, project) => {
                acc[project.project_name] = project.utilization;  
                return acc;
              }, {});
              
              return {
                name: item.user_name,  
                ...projects
              };
        })
    }
})