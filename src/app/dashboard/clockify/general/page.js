"use client"
import { getClockifyProjectSummary } from "@/app/api/clockify/getClockifyProjects";
import PieChartwithBarChart from "@/components/charts/PieChartwithBarChart";
import React, { useEffect, useState } from "react";

import { columns } from "./Columns";
import { ACTIVE_USERS_TYPES, getActiveUsers } from "@/app/api/clockify/getActiveUsers";
import { getUserReportSummary, REPORT_TYPES } from "@/app/api/clockify/getUserReportSummary";
import ClockifyDataTable from "./clockify-data-table";
import DateRangePicker from "@/components/DateRangePicker";
import { format, subDays } from "date-fns";
import {  formatClockifyDate } from "@/lib/utils";
import ClockifyTimeEntry from "@/components/ClockifyTimeTracking";
import { getEmployees } from "@/app/api/employees/getEmployees";
import { getClockifyIdProjects } from "@/app/api/projects/getProjects";




const pageSize=1000


export const users = [
  { userId: "66b44dd4e8576917c883711b", userName: "Animesh Adhikari", userEmail: "animesh@avinto.no" },
  { userId: "64364969efbb4f34828d1f8c", userName: "Animesh", userEmail: "animeshadhikari38@gmail.com" },
  { userId: "661381ab496c22503f32ee2d", userName: "Rishitosh Acharya", userEmail: "rishitosh@gmail.com" },
  { userId: "6683c1d790f19a47ee3dcaf6", userName: "Bishrut Bhattarai", userEmail: "bishrutbhattarai@gmail.com" },
  { userId: "66cd7372e20fa64bb538945b", userName: "Crystalstha91", userEmail: "crystalstha91@gmail.com" },
  { userId: "6661bdfaceac874d34c53d49", userName: "Dhiraj Kumar Sah Kanu", userEmail: "dhirajkumarsahkanu@gmail.com" },
  { userId: "63d773ad4483d445dc2c33b9", userName: "Kristian Fauske", userEmail: "fauskeconsulting@gmail.com" },
  { userId: "66c5d7d8d332f31dd7af44ba", userName: "Prakritee Sharma", userEmail: "prakritee.sharma@gmail.com" },
  { userId: "670363cbcdc43032a1442146", userName: "Ishu Shrestha", userEmail: "ishu@avinto.no" },
  { userId: "6703a2f3d8a5b241d2ab4d90", userName: "Nihira Shrestha", userEmail: "nihirastha20@gmail.com" },
  { userId: "67036519d3f7c72971b44a1e", userName: "Rupika Rasaili", userEmail: "pikarupika7@gmail.com" },
  { userId: "6715db97fd2ed55491519593", userName: "Ganesh Pokhrel", userEmail: "pkhrlgnsh@gmail.com" },
  { userId: "66b4de5c42122f578f868183", userName: "rabin Bhattarai", userEmail: "rabinbhattarai188@gmail.com" },
  { userId: "664c1d586c802f0391476b50", userName: "Rahul Kayastha", userEmail: "rahul@avinto.no" },
  { userId: "6715dcac898fb011477b674e", userName: "Sajjan Paudel", userEmail: "sajjanpaudel811@gmail.com" },
  { userId: "647c4ad8a2fe384cb7e81696", userName: "Sakar Sedhai", userEmail: "sakar.droogie@gmail.com" },
  { userId: "671639ea898fb01147870ac8", userName: "Sankalpa Joshi", userEmail: "sankalpajoshi351@gmail.com" },
  { userId: "63d7743c4483d445dc2c37dd", userName: "Saransha Shrestha", userEmail: "saranshashrestha03@gmail.com" },
  { userId: "6715dc678a4e0e6c1631180b", userName: "Shristi Shrestha", userEmail: "shristi0702@gmail.com" },
  { userId: "665c578585d0d5797bfffe3d", userName: "Shubha Pradhan", userEmail: "shubhaofficial07@gmail.com" },
  { userId: "66c5bf342a2b64489a5c81d4", userName: "Subifamhrzn", userEmail: "subifamhrzn@gmail.com" },
  { userId: "668e5531f37ecc469655e3da", userName: "Sayun Tamrakar", userEmail: "tamrakarsayun1@gmail.com" },
  { userId: "670f1a8790b0e73dcc73326a", userName: "Sagar Lamichhane", userEmail: "the.rain54@gmail.com" },
  { userId: "67163a368a4e0e6c163cce71", userName: null, userEmail: "yoshalimbu2001@gmail.com" },
  { userId: "66b33b068becbd615f3db9b8", userName: "Yosha Limbu", userEmail: "yoshalimbu2024@gmail.com" },
  { userId: "649be6b901c5062a0d421521", userName: "Yush Shrestha", userEmail: "yush.shrestha2013@gmail.com" }
];


export const clockifyProjects = [
  { projectId: "6436493afa74a43247e70f13", projectName: "Animesh" },
  { projectId: "670e41120a55801c11fd696c", projectName: "Avinto General" },
  { projectId: "6717768390254d10caababf8", projectName: "Benediks Transport" },
  { projectId: "6715b9d0fd2ed55491501ff5", projectName: "Bring API" },
  { projectId: "6715b9d9fd2ed55491502058", projectName: "Bring SBL" },
  { projectId: "6703641ed8a5b241d2a462ea", projectName: "Creative Arrangements" },
  { projectId: "66c5bf1e52d1f70e64e3e444", projectName: "E-bibaaha" },
  { projectId: "66fe52a4cdc43032a1fe61b5", projectName: "Hugo Assist" },
  { projectId: "66c6c5b219b51b469d7ccaa3", projectName: "Jambo Booking" },
  { projectId: "6711ed429f4db553e6edee70", projectName: "Krunch" },
  { projectId: "6729eb7f0066b72ea6e0c848", projectName: "LogiApp" },
  { projectId: "6729a11d5d0d3d59b22a4a0e", projectName: "Logistikknyhetene" },
  { projectId: "670faf3e90b0e73dcc801965", projectName: "Logitrans" },
  { projectId: "672b3ef3eae6c227b3bbd791", projectName: "Logitrans Design" },
  { projectId: "6715b9e3fd2ed554915020b8", projectName: "OEG Android" },
  { projectId: "671220462df45276ae141162", projectName: "OEG Offshore" },
  { projectId: "66cee83ec8e39b3ef12cd090", projectName: "Safari Planner O&M" },
  { projectId: "66166796b7d9b2173867225e", projectName: "Sakar hours" },
  { projectId: "66c5cd72204f1963fca58cc0", projectName: "SyncWave" },
  { projectId: "66b4e0123e25013d2ff9da6d", projectName: "Viken Fremtind Integration" },
  { projectId: "65ed5aa033c90b16eac35120", projectName: "Viken Power BI" },
  { projectId: "668e551351ffa171de759bf3", projectName: "Viken Transportsenter change requests" }
];

function combineUniqueUsers(activeUsers, inactiveUsers) {
  console.log(activeUsers,"lklklkl")
  const activeUserMap = new Map(activeUsers.map(user => [user.user_name, user]));
  const filteredInactiveUsers = inactiveUsers.filter(
    user => !activeUserMap.has(user.user_name)
  );
  const uniqueUsers = [...activeUsers, ...filteredInactiveUsers];

  return uniqueUsers;
}

const Clockify = () => {
  const [projects, setProjects] = useState();
  const [activeUsers, setActiveUsers] = useState();
  const [inactiveUsers, setInactiveUsers] = useState();
  const[allUsers,setAllUsers]=useState()
  const initialEndDate = new Date(); // Today's date
  const initialStartDate = subDays(initialEndDate, 28); // 4 weeks ago
  const [barChartUser, setBarChartUser] = useState(null);
  const[employeeClockifyDetails,setEmployeeClockifyDetails]=useState()
  // const[clockifyProjects,setClockifyProjects]=useState()
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
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
  if(employeeClockifyDetails)
  try {
      const transformedData = await getActiveUsers(users.length, ACTIVE_USERS_TYPES.USER_LIST, {
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


// const fetchProjectsWIthClockifyId=async()=>{
//   try{
//     const response=await getClockifyIdProjects();
    
//     setClockifyProjects(response)
  


//   } catch (error) {
//     console.error("Error fetching projects:", error);
// }
// }




  const fetchClockifyProjectsReport = async () => {
      try {
          const data = await getClockifyProjectSummary(formatClockifyDate(startDate),formatClockifyDate(endDate));
          if (data && data.groupOne) {
            const topProjects = data.groupOne
            .sort((a, b) => b.duration - a.duration)
              setProjects(topProjects);
          
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
  // fetchProjectsWIthClockifyId()
  fetchClockifyProjectsReport();
  fetchClockifyUsersProjectsReport()
  fetchClockifyUsersReport()
}, [endDate]);
useEffect(()=>{
  fetchClockifyActiveUsers();

},[employeeClockifyDetails])
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
  columns={columns(barChartUser,format(startDate, "LLL dd, y"),format(endDate,"LLL dd y"))} 
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
