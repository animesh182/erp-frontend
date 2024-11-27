"use client"
import { getUserReportSummary, REPORT_TYPES } from '@/app/api/clockify/getUserReportSummary';
import DateRangePicker from '@/components/DateRangePicker';
import KpiCard from '@/components/kpicard'
import { subDays } from 'date-fns';
import { DollarSign, Hourglass, ListOrdered } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import DataTable from '@/components/ui/data-table';
import { columns } from './Columns';
import { formatClockifyDate } from '@/lib/utils';


const ClockifyHistory = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [numberOfEntries, setNumberOfEntries] = useState(0);
  const [kpiData, setKpiData] = useState();
  const initialEndDate = new Date(); 
  const initialStartDate = subDays(initialEndDate, 28);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isFirstLoad, setIsFirstLoad] = useState(true); 

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };


  const fetchClockifyUsersReport = async (pageSize) => {
    try {
      if (startDate && endDate) {
        const data = await getUserReportSummary(
          formatClockifyDate(startDate),
          formatClockifyDate(endDate),
          pageSize,
          REPORT_TYPES.DETAILED_ENTRIES
        );
  
        if (data) {
          setKpiData(data.totals);
          
          if (isFirstLoad) {
            const entriesCount = data.totals?.[0]?.entriesCount || 0;
            setNumberOfEntries(entriesCount);
            setIsFirstLoad(false);
          } else {
            setAllUsers(data.timeentries);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchClockifyUsersReport();
  }, []); 

  useEffect(() => {
    if (numberOfEntries !== null && !isFirstLoad) {
      fetchClockifyUsersReport(numberOfEntries); 
    }
  }, [endDate,numberOfEntries]);



    const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600).toString().padStart(2, "0");
            return `${hours}`;
  };
  
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">

    <div className="flex justify-between">
      <h2 className="font-semibold text-2xl">Punch Clock History</h2>
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
        value={` ${formatDuration(kpiData[0]?.totalTime)} hours`} // Pass the raw number
        icon={<Hourglass className="h-4 w-4 text-muted-foreground" />}
      />
      <KpiCard
        title="Number of Time Entries"
        value={(kpiData[0]?.entriesCount)} // Pass the raw number
        // change={Number(kpiData.changeInExpenses)} // Pass the raw percentage number
        icon={<ListOrdered className="h-4 w-4 text-muted-foreground" />}
    
      />
      <KpiCard
        title="Total Amount"
        value={Number(kpiData[0]?.totalAmount)} // Pass the raw number
        // change={Number(kpiData.changeInProfit)} // Pass the raw percentage number
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
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
