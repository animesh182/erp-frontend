
"use client"
import PieChartwithBarChart from "@/components/charts/PieChartwithBarChart";
import { useEffect, useState } from "react";

import { ACTIVE_USERS_TYPES } from "@/app/api/clockify/getActiveUsers";
import { REPORT_TYPES } from "@/app/api/clockify/getUserReportSummary";
import { useActiveUsers } from "@/app/hooks/clockify/useActiveUsers";
import { useClockifyProjectSummary } from "@/app/hooks/clockify/useClockifyProjects";
import { useUserReportSummary } from "@/app/hooks/clockify/useUserReportSummary";
import { useEmployees } from "@/app/hooks/employees/useEmployees";
import { useClockifyProjects } from "@/app/hooks/projects/useClockifyProjects";
import ClockifyTimeEntry from "@/components/ClockifyTimeTracking";
import DateRangePicker from "@/components/DateRangePicker";
import { useDateRange } from "@/context/dateRangeContext/DateRangeContext";
import { formatClockifyDate } from "@/lib/utils";
import { format, startOfMonth } from "date-fns";
import ClockifyDataTable from "./clockify-data-table";
import { columns } from "./Columns";




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
  const[allUsers,setAllUsers]=useState()
  const initialEndDate = new Date(); 
  const initialStartDate = startOfMonth(initialEndDate) 
  const { startDate, endDate, setStartDate, setEndDate } = useDateRange();
  const[projectColor,setProjectColor]=useState()

  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const{data:clockifyProjects}=useClockifyProjects(true)
const{data:employeeClockifyDetails}=useEmployees()
  const { data:activeUsers,isLoading} = useActiveUsers({
    items: employeeClockifyDetails?.length,
    type: ACTIVE_USERS_TYPES.USER_LIST,
    additionalData: {   employeeClockifyDetails,
      clockifyProjects}, // Pass additional data if needed
});

const { data } = useClockifyProjectSummary({
  startDate: formatClockifyDate(startDate),
  endDate: formatClockifyDate(endDate),
});


const { data: { timeentries: inactiveUsers } = {} } = useUserReportSummary({
  start: formatClockifyDate(startDate),
  end: formatClockifyDate(endDate),
  pageSize,
  messageType: REPORT_TYPES.INACTIVE_USERS,
});
const { data:barChartUser} = useUserReportSummary({
  start: formatClockifyDate(startDate),
  end: formatClockifyDate(endDate),
  pageSize,
  messageType: REPORT_TYPES.PROJECT_SUMMARY,
});



const date=new Date()
const oneMonthAgo = new Date(date);  
oneMonthAgo.setMonth(date.getMonth() - 1);
const oneDayAfter = new Date(date);  
oneDayAfter.setDate(date.getDate() + 1);

  useEffect(() => {
    if (data && data.groupOne) {
        const colors = data.groupOne.map((project) => ({
            projectName: project.name,
            projectColor: project.color,
        }));
        setProjectColor(colors);
        setProjects(data.groupOne)
    }
  }, [data]);

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