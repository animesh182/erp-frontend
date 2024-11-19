"use client"
import { getUserReportSummary } from '@/app/api/clockify/getUserReportSummary';
import DateRangePicker from '@/components/DateRangePicker';
import KpiCard from '@/components/kpicard'
import { subDays } from 'date-fns';
import { Activity, CreditCard, DollarSign } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import ClockifyDataTable from '../general/clockify-data-table';
import DataTable from '@/components/ui/data-table';
import { columns } from './Columns';
import { formatClockifyDate, formatDuration } from '@/lib/utils';




// const ClockifyHistory = () => {

// const[allUsers,setAllUsers]=useState()
// const[numberOfEntries,setNumberOfEntries]=useState()
// const[kpiData,setKpiData]=useState()
// const initialEndDate = new Date(); // Today's date
// const initialStartDate = subDays(initialEndDate, 28);
// const [startDate, setStartDate] = useState(initialStartDate);
// const [endDate, setEndDate] = useState(initialEndDate);

// const handleDateChange = (startDate, endDate) => {
//   setStartDate(startDate);
//   setEndDate(endDate);
// };

//     const fetchClockifyUsersReport = async () => {
//       try {
//       if(startDate && endDate){

//           const data = await getUserReportSummary(formatClockifyDate(startDate),formatClockifyDate(endDate));
      
//           if (data) {

            
//             setKpiData(data.totals)
//             setNumberOfEntries(data.totals[0].entriesCount)
            
//             const timeEntriesInformation=data.timeentries
//             if(timeEntriesInformation)
//               {      
//                 const initialTransformedData = Object.values(timeEntriesInformation).map((users) => ({
//                   latest_activity: users.description || "No data available",
//                   name: users.userName,
//                   user_email: users.userEmail,
//                   projectName: users.projectName,
//                   start_time:users.timeInterval.start,
//                   end_time:users.timeInterval.end,
//                   end_time:users.timeInterval.end,
//                   duration:users.timeInterval.duration,
//                   project_color:users.projectColor
//                   }));
//             setAllUsers(initialTransformedData);
//             }
    
//           } else {
//             console.log("No user data found");
//           }
//         } }catch (error) {
//           console.error("Error fetching users:", error);
//         }
//         // fetchClockifyUsersReport()
//       };
    

//       useEffect(()=>{
//         fetchClockifyUsersReport()
//       },[endDate])

const ClockifyHistory = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [numberOfEntries, setNumberOfEntries] = useState(0);
  const [kpiData, setKpiData] = useState();
  const initialEndDate = new Date(); // Today's date
  const initialStartDate = subDays(initialEndDate, 28);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // To track first load

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const fetchClockifyUsersReport = async (pageSize) => {
    try {
      if (startDate && endDate) {
        // Pass numberOfEntries to the API call
        const data = await getUserReportSummary(
          formatClockifyDate(startDate),
          formatClockifyDate(endDate),
          pageSize // Send the pageSize as numberOfEntries
        );

        if (data) {
          setKpiData(data.totals);

          if (isFirstLoad) {
            const entriesCount = data.totals?.[0]?.entriesCount || 0;
            setNumberOfEntries(entriesCount);
            setIsFirstLoad(false); // Set first load complete
          } else {
            const timeEntriesInformation = data.timeentries;
            if (timeEntriesInformation) {
              const initialTransformedData = Object.values(timeEntriesInformation).map((users) => ({
                latest_activity: users.description || "No data available",
                name: users.userName,
                user_email: users.userEmail,
                projectName: users.projectName,
                start_time: users.timeInterval.start,
                end_time: users.timeInterval.end,
                duration: users.timeInterval.duration,
                project_color: users.projectColor,
              }));
              setAllUsers(initialTransformedData);
            }
          }
        } else {
          console.log("No user data found");
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchClockifyUsersReport();
  }, []); // Trigger on date change

  useEffect(() => {
    if (numberOfEntries !== null && !isFirstLoad) {
      fetchClockifyUsersReport(numberOfEntries); 
    }
  }, [endDate,numberOfEntries]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">

    <div className="flex justify-between">
      <h2 className="font-semibold text-2xl">Clockify History</h2>
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

    <div className="flex gap-4 w-full">
{ kpiData &&  ( 
  <>  <KpiCard
        title="Total Time"
        value={ formatDuration(kpiData[0]?.totalTime)} // Pass the raw number
        // change={Number(kpiData.changeInRevenue)} // Pass the raw percentage number
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <KpiCard
        title="Number of Time Entries"
        value={(kpiData[0]?.entriesCount)} // Pass the raw number
        // change={Number(kpiData.changeInExpenses)} // Pass the raw percentage number
        icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
    
      />
      <KpiCard
        title="Total Amount"
        value={Number(kpiData[0]?.totalAmount)} // Pass the raw number
        // change={Number(kpiData.changeInProfit)} // Pass the raw percentage number
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
       
      />
      </>)}
    </div>
    <div className=''>
    {allUsers && (



  <DataTable
        title="Time Entries"
        subtitle="The table captures time entries of all users associated with the company"
        columns={columns()}
        data={allUsers}
      />
)}
</div>
    </main>
  )
}

export default ClockifyHistory
