
"use client"
import { getUserReportSummary, REPORT_TYPES } from '@/app/api/clockify/getUserReportSummary';
import DateRangePicker from '@/components/DateRangePicker';
import KpiCard from '@/components/kpicard';
import DataTable from '@/components/ui/data-table';
import { useDateRange } from '@/context/dateRangeContext/DateRangeContext';
import { formatClockifyDate } from '@/lib/utils';
import { DollarSign, Hourglass, ListOrdered } from 'lucide-react';
import { useEffect, useState } from 'react';
import { columns } from './Columns';
import { KpiSkeleton, ProjectPageSkeletonCard } from '@/components/Skeletons';

const ClockifyHistory = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [numberOfEntries, setNumberOfEntries] = useState(1000); // Default to 1000
  const [kpiData, setKpiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { startDate, endDate, setStartDate, setEndDate } = useDateRange();

  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const fetchClockifyUsersReport = async (pageSize = 1000) => {
    try {
      setIsLoading(true);
      if (startDate && endDate) {
        const data = await getUserReportSummary(
          formatClockifyDate(startDate),
          formatClockifyDate(endDate),
          1000,
          REPORT_TYPES.DETAILED_ENTRIES
        );
  
        if (data) {
          setKpiData(data.totals);
          setAllUsers(data.timeentries);
          
          // Update number of entries if not set or if different
          const entriesCount = data.totals?.entriesCount || pageSize;
          setNumberOfEntries(entriesCount);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch when date range changes
  useEffect(() => {
    if (startDate && endDate) {
      fetchClockifyUsersReport(numberOfEntries);
    }
  }, [endDate]);

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600).toString().padStart(2, "0");
    return `${hours}`;
  };

  return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
    
        <div className="flex justify-between">
          <h2 className="font-semibold text-2xl">Punch Clock History</h2>
          {/* {initialStartDate && initialEndDate && handleDateChange && ( */}
                    <div>
                      <DateRangePicker
                        onDateChange={handleDateChange}
                        initialStartDate={startDate}
                        initialEndDate={endDate}
                      />
                    </div>
                  {/* )} */}
                  
                  
    </div>
    
         {/* <div className="flex gap-4 w-full"> */}
        <div className="grid grid-cols-3 gap-4">
    { isLoading ?
     [...Array(3)].map((_, index) => (
      <div key={index} >
        <KpiSkeleton />
      </div>
    ))
    :  ( 
      <>
      <KpiCard
            title="Total Time"
            value={` ${formatDuration(kpiData[0]?.totalTime)} hours`} // Pass the raw number
            icon={<Hourglass className="h-4 w-4 text-muted-foreground" />}
            isMoney={false}
          />
          <KpiCard
            title="Number of Time Entries"
            value={(kpiData[0]?.entriesCount)} // Pass the raw number
            isMoney={false}
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
        {isLoading ?
        <ProjectPageSkeletonCard/> :
    
    
    
      <DataTable
            title="Time Entries"
            subtitle="The table captures time entries of all users associated with the company"
            columns={columns()}
            data={allUsers}
            // maxHeight="max-h-[1000px]"
          />
    }

    </div>
        </main>
      )
    
}

export default ClockifyHistory