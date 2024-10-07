
import { getProjectById } from "@/app/api/projects/getProjectById";
import { getProjects } from "@/app/api/projects/getProjects";
import { useQueries, useQuery } from "@tanstack/react-query";

export const useProjects = () => useQuery({
    queryKey: ["projects"],
    queryFn:  getProjects,
    select:(data)=>{
      const datas= data.data
  
      return datas.map((project)=>{
        const clientInfo=project.client_contact;
        const start=new Date(project.start_date);
        const end=new Date(start);
        const estimatedDuration = parseInt(project.estimated_duration, 10);
        end.setMonth(end.getMonth() + estimatedDuration);
      
        return{
          id:project.id,
          name:project.name,
          projectCategory:project.type,
          platform:project.platform,
          clientImage:"/default-avatar.jpg",
          clientName:clientInfo.name,
          clientEmail:clientInfo.email,
          clientId:clientInfo.id,
          clientPhone:clientInfo.phone_number,
          teamMembersImage:["/default-avatar.jpg", "/default-avatar.jpg"],
          teamMembersCount:project.all_user_projects.length,

          status:project.project_status===1? 
          "done" : project.project_status===3? "ongoing": "not-started",

          health: (project.project_health || "").replace(/_/g, '-').toLowerCase(),
         
          progress:parseInt(project.completion),
          startDate:new Date(project.start_date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', 
            year: 'numeric',
          }),
          endDate:end.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', 
            year: 'numeric',
          }),
          budget:project.budget,
          projectDescription:project.description || ""
        }
      })
    }
  })


  export const useProjectByIdForEmployees = (projectIds) => {
  
    // Ensure projectIds is always an array
    const safeProjectIds = Array.isArray(projectIds) ? projectIds : [];
  
    const projectQueries = useQueries({
      queries: safeProjectIds.map(id => ({
        queryKey: ['projects', id],
        queryFn: () => getProjectById(id),
        enabled: !!id,
        select: (data) => {
          console.log(`Data received for project ${id}:`, data);
          return {
            id: data.id,
            title: data.name || "N/A",
            projectName: data.name || "N/A",
            progress: data.completion || 0,
          };
        }
      }))
    });
  

    
    const isLoading = projectQueries.some(query => query.isLoading);
    const isError = projectQueries.some(query => query.isError);
    const data = projectQueries.map(query => query.data).filter(Boolean);
  
    console.log("useProjectz result:", { data, isLoading, isError });
  
    return { data, isLoading, isError };
  };
  
 
  export const useProjectsById = (id) => useQuery({
    queryKey: ["projects",id],
    queryFn: ()=>getProjectById(id),
    select:(data)=>{
   
      if (!data) {
        throw new Error("Project data not found");
      }
      const start=new Date(data.start_date);
        const end=new Date(start);
        const estimatedDuration = parseInt(data.estimated_duration, 10);
        end.setMonth(end.getMonth() + estimatedDuration);
      
        return{
          id:data.id,
          name: data.name || "N/A",
          health: (data.project_health || "").replace(/_/g, '-').toLowerCase(),
          status:data.project_status===1? 
          "done" : data.project_status===3? "ongoing": "not-started",
          
          
          
          daysLeft: data.estimated_duration*30,


          projectCategory:data.type,
          platform:data.platform,
          startDate:new Date(data.start_date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', 
            year: 'numeric',
          }),
          endDate:end.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', 
            year: 'numeric',
          }),
          progress:parseInt(data.completion),
          devUtilization: data.all_user_projects
          .reduce((total, project) => total + parseInt(project.utilization, 10), 0),
          teamMembersCount: (data.all_user_projects && data.all_user_projects.length) || 0,
        }
     
    }
  })


  export const useEmployeeUtilization = (id) => useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectById(id),
    select: (data) => {
    
      if (!data.all_user_projects || !Array.isArray(data.all_user_projects)) {
        return null;
      }
  
      return data.all_user_projects.map((employee) => {
        return {
          id: employee.user_id,
          imageUrl: "/default-avatar.jpg",
          employeeName: employee.user_name || "N/A",
          email: employee.user_email || "N/A",
          role: employee.project_role || "N/A",
          timeAllocated: "40 hours/week",
          startDate: employee.start_date || "N/A",
          endDate: employee.end_date || "N/A",
        };
      });
    },
  });
  


  export const useProjectClient=(id)=>useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectById(id),
    select: (data) => {
    return{
      description:data.description || "N/A",
      clientName:data.client_contact.name || "N/A",
      clientEmail:data.client_contact.email || "N/A",
      teamMembersCount: (data.all_user_projects && data.all_user_projects.length) || "N/A",
      progress:Number(data.completion) || 0
    }
    }
  })