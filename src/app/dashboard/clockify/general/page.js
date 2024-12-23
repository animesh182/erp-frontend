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
import { useEmployees } from "@/app/hooks/employees/useEmployees";
import { useActiveUsers } from "@/app/hooks/clockify/useActiveUsers";
import { useClockifyProjects } from "@/app/hooks/projects/useClockifyProjects";
import { useClockifyProjectSummary } from "@/app/hooks/clockify/useClockifyProjects";
import { useUserReportSummary } from "@/app/hooks/clockify/useUserReportSummary";




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
  const[allUsers,setAllUsers]=useState()
  const initialEndDate = new Date(); 
  const initialStartDate = startOfMonth(initialEndDate) 
  const { startDate, endDate, setStartDate, setEndDate } = useDateRange();
  // const[projectColor,setProjectColor]=useState()
  const date=new Date()
  const oneMonthAgo = new Date(date);  
  oneMonthAgo.setMonth(date.getMonth() - 1);
  const oneDayAfter = new Date(date);  
  oneDayAfter.setDate(date.getDate() + 1);

      const { data:clockifyProjects, error:clockifyProjectsError,isError:clockifyProjectsIsError, isLoading:clockifyProjectsIsLoading } = useClockifyProjects(false);
  const{data:employeeClockifyDetails}=useEmployees()
  const{data:activeUsers}=useActiveUsers(employeeClockifyDetails?.length, ACTIVE_USERS_TYPES.USER_LIST, {
    employeeClockifyDetails,
      clockifyProjects
  });

  const{data:clockifyProjectSummary}=useClockifyProjectSummary(formatClockifyDate(startDate),formatClockifyDate(endDate))
  const { projects, projectColor } = clockifyProjectSummary || {};

  const{data:inactiveUsers}=useUserReportSummary(  formatClockifyDate(oneMonthAgo),formatClockifyDate(oneDayAfter),pageSize,REPORT_TYPES.INACTIVE_USERS)
  const{data:barChartUser}=useUserReportSummary(  formatClockifyDate(oneMonthAgo),formatClockifyDate(oneDayAfter),pageSize,REPORT_TYPES.PROJECT_SUMMARY)


  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };


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
            name: project.projectName,
            value: (project.duration),
            color: project.projectColor
            
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
