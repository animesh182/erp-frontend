import { getEmployeeProjects } from "@/app/api/employee/getEmployeeProjects";
import { getEmployees } from "@/app/api/employee/getEmployees";

import { useQuery } from "@tanstack/react-query";

export const useEmployees = () => useQuery({
    queryKey: ["employees"],
    queryFn:  getEmployees,
    select:(data)=>{
      const employees=data.data;
      return employees.map((employee)=>{
        return {
          userId:employee.id,
          id: employee.employee_id,
      employeeName: employee.full_name,
      imageUrl: "/default-avatar.jpg",
      email: employee.email || "N/A",
      role: employee.role===1?"UIUX Developer":
      employee.role===2?"Frontend Developer":
      employee.role===3?"Backend Developer":
      employee.role===4?"Human Resource":
      employee.role===5?"Project Manager":
      employee.role===6?"Data Analyst":
      employee.role===7?"Executive Director":
      employee.role===8?"React JS Developer": "QA Analyst",
      type: employee.employment_type,
      salary: employee.salary,



      employeeId: employee.employee_id,
      dateOfBirth:"2002-12-03",
      gender: "N/A",
      maritalStatus: "N/A",
      country: employee.country || "N/A",
      phone: employee.phone_number || "N/A",
   
      linkedInName: employee.full_name || "N/A",
      linkedInUrl: "N/A",
      jobTitle:employee.role===1?"UIUX Developer":
      employee.role===2?"Frontend Developer":
      employee.role===3?"Backend Developer":
      employee.role===4?"Human Resource":
      employee.role===5?"Project Manager":
      employee.role===6?"Data Analyst":
      employee.role===7?"Executive Director":
      employee.role===8? "React JS Developer": "QA Analyst",
      level: "L"+employee.level || "N/A",
      department: "N/A",
      employeeType: employee.employment_type || "N/A",
      supervisor: "N/A",
      panNumber: String(employee.PAN) || "N/A",
        }
      })
    }

  })



  // export const useEmployeeProjects = (employeeId) =>
  //   useQuery({
  //     queryKey: ["empProject", employeeId],
  //     queryFn: () => getEmployeeProjects(employeeId),
  //     select: (data) => {
    
  
  //       const normalizedData = Array.isArray(data) ? data : data ? [data] : [];
  
  //       return normalizedData.map((data) => {

  //         const empProject=data.data
  
  //         const startDate = new Date(empProject.start_date);
  //         const endDate = empProject.end_date
  //           ? new Date(empProject.end_date)
  //           : new Date();
  
  //         const totalDaysInvolved = Math.floor(
  //           (endDate - startDate) / (1000 * 60 * 60 * 24)
  //         );
  //         return {
  //           title: "N/A",
  //           projectName: "N/A",
  //           category: empProject?.project_role || "N/A",
  //           status: empProject?.end_date ? "Finished" : "Ongoing",
  //           startDate: empProject?.start_date || "N/A",
  //           endDate: empProject?.end_date || "End Date not Specified",
  //           progress: 70,
  //           timeInvolved: empProject?.utilization || "N/A",
  //           totalDaysInvolved: totalDaysInvolved || "N/A",
  //         };
  //       });
  //     },
  //   });
  
  export const useEmployeeProjects = (employeeId) =>
    useQuery({
      queryKey: ["empProject", employeeId],
      queryFn: () => getEmployeeProjects(employeeId),
      select: (response) => {
        // `response` is the full object containing `success` and `data`
        const normalizedData = Array.isArray(response.data) ? response.data : response.data ? [response.data] : [];
  
        return normalizedData.map((empProject) => {
          const startDate = new Date(empProject.start_date);
          const endDate = empProject.end_date ? new Date(empProject.end_date) : new Date();
  
          // Calculate the difference in days
          const totalDaysInvolved = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  
          return {
            title: "N/A",
            projectName: "N/A", 
            category: empProject.project_role || "N/A",
            status: empProject.end_date ? "Done" : 
            !empProject.start_date ? "Not Started" : 
            "Ongoing",
            startDate: empProject.start_date || "N/A",
            endDate: empProject.end_date || "End Date not Specified",
            progress: 70,
            timeInvolved: empProject.utilization || "N/A",
            totalDaysInvolved: totalDaysInvolved || "N/A",
            projectId:empProject.project_id
          };
        });
      },
    });
  
