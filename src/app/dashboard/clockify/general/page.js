"use client"
import { getClockifyProjectSummary } from "@/app/api/clockify/getClockifyProjects";
import PieChartwithBarChart from "@/components/charts/PieChartwithBarChart";
import { useEffect, useState } from "react";

import { ACTIVE_USERS_TYPES, getActiveUsers } from "@/app/api/clockify/getActiveUsers";
import { getUserReportSummary, REPORT_TYPES } from "@/app/api/clockify/getUserReportSummary";
import { getEmployees } from "@/app/api/employees/getEmployees";
import { getClockifyIdProjects } from "@/app/api/projects/getProjects";
import ClockifyTimeEntry from "@/components/ClockifyTimeTracking";
import DateRangePicker from "@/components/DateRangePicker";
import { formatClockifyDate } from "@/lib/utils";
import { format, startOfMonth } from "date-fns";
import ClockifyDataTable from "./clockify-data-table";
import { columns } from "./Columns";
import { useDateRange } from "@/context/dateRangeContext/DateRangeContext";




const pageSize=1000

function combineUniqueUsers(activeUsers, inactiveUsers) {
  const activeUserMap = new Map(activeUsers.map(user => [user.user_id, user]));

  const filteredInactiveUsers = inactiveUsers.filter(
    user => !activeUserMap.has(user.user_id) // Replace user_name with user_id
  );
  
  const uniqueUsers = [...activeUsers, ...filteredInactiveUsers];

  return uniqueUsers;
}

const Clockify = () => {
  const [projects, setProjects] = useState();
  const [activeUsers, setActiveUsers] = useState();
  const [inactiveUsers, setInactiveUsers] = useState();
  const[allUsers,setAllUsers]=useState()
  const initialEndDate = new Date(); 
  const initialStartDate = startOfMonth(initialEndDate) 
  const [barChartUser, setBarChartUser] = useState(null);
  const[employeeClockifyDetails,setEmployeeClockifyDetails]=useState()
  const[clockifyProjects,setClockifyProjects]=useState()
  const { startDate, endDate, setStartDate, setEndDate } = useDateRange();
  const[projectColor,setProjectColor]=useState()

  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };



const fetchEmployeeDetails=async()=>{
  try{
    const response=await getEmployees();
    const clockifyIds = response.data.map((employee) => ({
      userId: employee.clockify_user_id,
      userName: employee.full_name,
      userEmail: employee.email, // Replace with the actual email field name
    }));

    setEmployeeClockifyDetails(clockifyIds);


  } catch (error) {
    console.error("Error fetching active users:", error);
}
}
const fetchClockifyActiveUsers = async () => {
  if(employeeClockifyDetails && clockifyProjects)
  try {
      const transformedData = await getActiveUsers(employeeClockifyDetails.length, ACTIVE_USERS_TYPES.USER_LIST, {
        employeeClockifyDetails,
          // users,
          clockifyProjects
      });
      
      if (transformedData) {
          setActiveUsers(transformedData);
      } else {
          console.log("No active users found");
      }
  } catch (error) {
      console.error("Error fetching active users:", error);
  }
};



const date=new Date()
const oneMonthAgo = new Date(date);  
oneMonthAgo.setMonth(date.getMonth() - 1);
const oneDayAfter = new Date(date);  
oneDayAfter.setDate(date.getDate() + 1);

// Ensure it's correctly adjusted to the previous day


const fetchProjectsWIthClockifyId=async()=>{
  try{
    const response=await getClockifyIdProjects();
    
    setClockifyProjects(response)
  


  } catch (error) {
    console.error("Error fetching projects:", error);
}
}





  const fetchClockifyProjectsReport = async () => {
      try {
          const data = await getClockifyProjectSummary(formatClockifyDate(startDate),formatClockifyDate(endDate));
          if (data && data.groupOne) {
            const topProjects = data.groupOne
            .sort((a, b) => b.duration - a.duration)
              setProjects(topProjects);


              setProjectColor(topProjects.map((project)=>{
                return {projectName:project.name,
                        projectColor:project.color
                }
              }))
          } else {
              console.log("No projects found");
          }
      } catch (error) {
          console.error("Error fetching projects:", error);
      }
  };

  const fetchClockifyUsersReport = async () => {
    try {
      const data = await getUserReportSummary(
        formatClockifyDate(oneMonthAgo),
        formatClockifyDate(oneDayAfter),
        pageSize,
        REPORT_TYPES.INACTIVE_USERS
      );
  
      if (data) {

        setInactiveUsers(data.timeentries);
        //to send projects color to data table 
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchClockifyUsersProjectsReport = async () => {
    try {
      const data = await getUserReportSummary(
        formatClockifyDate(startDate),
        formatClockifyDate(endDate),
        pageSize,
        REPORT_TYPES.PROJECT_SUMMARY
      );
  
      if (data) {
        setBarChartUser(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };



useEffect(() => {
  fetchEmployeeDetails()
  fetchProjectsWIthClockifyId()
  fetchClockifyProjectsReport();
  fetchClockifyUsersProjectsReport()
  fetchClockifyUsersReport()
}, [endDate]);
useEffect(()=>{
  fetchClockifyActiveUsers();

},[employeeClockifyDetails,clockifyProjects])
useEffect(() => {

  if (activeUsers && inactiveUsers) {
    setAllUsers(combineUniqueUsers(activeUsers, inactiveUsers));
  }
}, [activeUsers, inactiveUsers]); 


const clockifyTimeEntryProp={
  clockifyUserId:process.env.NEXT_PUBLIC_CLOCKIFY_API_KEY,
  userName:"Animesh Adhikari"
}

  return (
    <div className="grid grid-cols-1 p-6 gap-8">
        <div className="flex justify-between">
      <div className="font-semibold text-2xl">Team Activities</div>
      {initialStartDate && initialEndDate && handleDateChange && (
                <div>
                  <DateRangePicker
                    onDateChange={handleDateChange}
                    initialStartDate={startDate}
                    initialEndDate={endDate}
                  />
                </div>
              )}
              
              
</div>
        {projects  && 
        <>
      <div>
        <PieChartwithBarChart className="" chartData={projects.map((project, index) => ({
            name: project.name,
            value: (project.duration),
            color: project.color
            
          }))} />
      </div>

      </>
      }
              <ClockifyTimeEntry clockifyTimeEntryProp={clockifyTimeEntryProp}/>
      {allUsers && (

      

      <ClockifyDataTable
  columns={columns(barChartUser,format(startDate, "LLL dd, y"),format(endDate,"LLL dd y"),projectColor)} 
  data={allUsers}
  title={"Team Activities"}
  filterColumn={"status"}
  subtitle={"View detailed information about all team activities in this table."}
/>
    )}
    </div>
  );
};

export default Clockify;
