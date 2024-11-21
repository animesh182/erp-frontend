"use client"
import { getClockifyProjectSummary } from "@/app/api/clockify/getClockifyProjects";
import PieChartwithBarChart from "@/components/charts/PieChartwithBarChart";
import React, { useEffect, useState } from "react";

import { columns } from "./Columns";
import { getActiveUsers } from "@/app/api/clockify/getActiveUsers";
import { getUserReportSummary } from "@/app/api/clockify/getUserReportSummary";
import ClockifyDataTable from "./clockify-data-table";
import DateRangePicker from "@/components/DateRangePicker";
import { format, subDays } from "date-fns";
import {  formatClockifyDate } from "@/lib/utils";
import ClockifyTimeEntry from "@/components/ClockifyTimeTracking";




const pageSize=1000
const dummyData = [
  {
    team_member: "John Doe",
    latest_activity: "Code Review",
    time: "10:15 AM",
    status: "Active",
    time_tracked: "12h 30m",
  },
  {
    team_member: "Jane Smith",
    latest_activity: "Design Mockups",
    time: "09:45 AM",
    status: "In Progress",
    time_tracked: "15h 20m",
  },
  {
    team_member: "Alex Johnson",
    latest_activity: "Client Meeting",
    time: "11:30 AM",
    status: "Completed",
    time_tracked: "8h 45m",
  },
  {
    team_member: "Emily Davis",
    latest_activity: "Documentation",
    time: "02:10 PM",
    status: "Pending",
    time_tracked: "5h 10m",
  },
  {
    team_member: "Michael Brown",
    latest_activity: "Testing",
    time: "01:20 PM",
    status: "Active",
    time_tracked: "10h 55m",
  },
];


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

  // State to hold date range
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };


const fetchClockifyActiveUsers = async () => {
  try {
    const data = await getActiveUsers(users.length); // Fetch active users
    if (data) {
      const activeUsersWithNames = data.map((user) => {
        const matchedUser = users.find((u) => u.userId === user.userId);
        const matchedProjects = clockifyProjects.find((project) => project.projectId === user.projectId);
        return {
          ...user,
          userName: matchedUser ? matchedUser.userName : "Unknown User",
          userEmail: matchedUser ? matchedUser.userEmail : "Unknown User",
          projectName: matchedProjects ? matchedProjects.projectName : "Unknown Project",
        };
      });

      activeUsersWithNames.sort((a, b) => new Date(b.timeInterval.start) - new Date(a.timeInterval.start));
      
      const updateActiveUsers = () => {
        const transformedData = activeUsersWithNames.map((activeUser) => ({
          user_name: activeUser.userName,
          user_email: activeUser.userEmail,
          latest_activity: activeUser.description || "No data available",
          project_name: activeUser.projectName,
          time: activeUser.timeInterval.start,
          status: "Ongoing",
        }));

        setActiveUsers(transformedData);
      };
      updateActiveUsers();
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
      const data = await getUserReportSummary(formatClockifyDate(oneMonthAgo),formatClockifyDate(oneDayAfter),pageSize);
  
      if (data) {
        const latestUserData = data.timeentries.reduce((acc, inactiveUser) => {
          const userId = inactiveUser.userId || inactiveUser.userName; 
          if (!acc[userId] || new Date(inactiveUser.timeInterval.end) > new Date(acc[userId].timeInterval.end)) {
            acc[userId] = inactiveUser; 
          }
          return acc;
        }, {});
      
        const initialTransformedData = Object.values(latestUserData).map((inactiveUser) => ({
          user_name: inactiveUser.userName,
          user_email: inactiveUser.userEmail,
          latest_activity: inactiveUser.description || "No data available",
          project_name: inactiveUser.projectName,
          time: formatMillisecondsToHourDifference(new Date(inactiveUser.timeInterval.start), new Date(inactiveUser.timeInterval.end)), // Initial duration
          status: formatTimeAgo(inactiveUser.timeInterval.start),
        }));
  
        // Set the transformed data to the state
        setInactiveUsers(initialTransformedData);



      } else {
        console.log("No user data found");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchClockifyUsersProjectsReport = async () => {
    try {
      const data = await getUserReportSummary(formatClockifyDate(startDate),formatClockifyDate(endDate),pageSize);
      if (data) {
    

        //to be sent to barchart




          const userProjectsMap = {};
          data.timeentries.forEach((entry) => {
            const { userName, projectName, projectColor ,timeInterval} = entry;
            const duration = timeInterval.duration; 
            if (!userProjectsMap[userName]) {
              userProjectsMap[userName] = {
                userName,
                projects: [],
              };
            }

            // Avoid adding duplicate projects
            const existingProject = userProjectsMap[userName].projects.find(
              (project) => project.projectName === projectName
            );

            if (existingProject) {
              // If the project exists, accumulate the duration
              existingProject.duration += duration;
            } else {
              // If the project doesn't exist, add it and set the initial duration
              userProjectsMap[userName].projects.push({
                projectName,
                projectColor,
                duration, 
                count:1// Add the duration here
              });
            }
          });
          const transformedUsersProjects = Object.values(userProjectsMap);

          // const selected = transformedUsersProjects.find(
          //   (user) => user.userName === userName
          // );
          setBarChartUser(transformedUsersProjects || null); 
        

      } else {
        console.log("No user data found");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  console.log(barChartUser,"barchartrtr")
  function formatMillisecondsToHourDifference(startTime, endTime) {
  const timeDifference = new Date(endTime) - new Date(startTime);
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Format in hh:mm:ss
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
  
function formatTimeAgo(endTime) {
  const currentTime = new Date()
  const endDate = new Date(endTime);
  const timeDifference = currentTime - endDate;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }
}


console.log(barChartUser,"barbar")
useEffect(() => {
  fetchClockifyProjectsReport();
  fetchClockifyUsersProjectsReport()
  fetchClockifyUsersReport()
}, [endDate]);
useEffect(()=>{
  fetchClockifyActiveUsers();
},[])
useEffect(() => {

  if (activeUsers && inactiveUsers) {
    setAllUsers(combineUniqueUsers(activeUsers, inactiveUsers));
  }
}, [activeUsers, inactiveUsers]); 


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
               <ClockifyTimeEntry userId={process.env.NEXT_PUBLIC_CLOCKIFY_API_KEY}/>
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
