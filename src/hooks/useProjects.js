
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
          projectCategory:project.name,
          platform:project.description,
          clientImage:"/default-avatar.jpg",
          clientName:clientInfo.name,
          clientEmail:clientInfo.email,
          teamMembersImage:["/default-avatar.jpg", "/default-avatar.jpg"],
          teamMembersCount:project.all_user_projects.length,

          status:project.project_status===1? 
          "done" : project.project_status===2? "ongoing": "not-started",

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
        }
      })
    }
  })


  export const useProjectInvoices=()=>useQuery({
    queryKey:["projectInvoice"],
    queryFn:getProjects,
    select: (data) => {
      return data.data.map((project) => {
        // Initialize the expenses object
        const expenses = {
          direct: 0,
          fixed: 0,
          npa: 0,
          recurring:0
        };

        // Accumulate expenses from invoices
        project.invoices.forEach((invoice) => {
          const amount = parseFloat(invoice.amount) || 0; // Ensure amount is a number
          if (invoice.type === "Direct Cost") {
            expenses.direct += amount;
          } else if (invoice.type === "NPA Cost") {
            expenses.npa += amount;
          } else if (invoice.type === "fixed") {
            expenses.fixed += amount;
          }
         else
         expenses.recurring+=amount;
        });

        return {
          project: project.name || "N/A",
          totalIncome: project.total_revenue || "N/A",
          expenses,
          isRecurring: project.type==="fixed"?  false: true, 
          completed: project.completed==="100.00"? true:false,
        };
      });
    },
  });

  export const useProjectById = (projectIds) => {
    console.log("useProjectz called with projectIds:", projectIds);
  
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
  
 