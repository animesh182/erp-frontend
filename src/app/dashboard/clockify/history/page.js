
"use client"
import { REPORT_TYPES } from '@/app/api/clockify/getUserReportSummary';
import { useUserReportSummary } from '@/app/hooks/clockify/useUserReportSummary';
import DateRangePicker from '@/components/DateRangePicker';
import KpiCard from '@/components/kpicard';
import { KpiSkeleton, ProjectPageSkeletonCard } from '@/components/Skeletons';
import DataTable from '@/components/ui/data-table';
import { useDateRange } from '@/context/dateRangeContext/DateRangeContext';
import { formatClockifyDate } from '@/lib/utils';
import { DollarSign, Hourglass, ListOrdered } from 'lucide-react';
import { columns } from './Columns';

const ClockifyHistory = () => {


  const { startDate, endDate, setStartDate, setEndDate } = useDateRange();

  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };
  const { data,isLoading} = useUserReportSummary({
    start: formatClockifyDate(startDate),
    end: formatClockifyDate(endDate),
    pageSize: 1000,
    messageType: REPORT_TYPES.DETAILED_ENTRIES,
});

const kpiData = data?.totals;
const allUsers = data?.timeentries;


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
            value={` ${formatDuration(kpiData[0]?.totalTime)} hours`}
            icon={<Hourglass className="h-4 w-4 text-muted-foreground" />}
            isMoney={false}
          />
          <KpiCard
            title="Number of Time Entries"
            value={(kpiData[0]?.entriesCount)}
            isMoney={false}
            // change={Number(kpiData.changeInExpenses)} // Pass the raw percentage number
            icon={<ListOrdered className="h-4 w-4 text-muted-foreground" />}
        
          />
          <KpiCard
            title="Total Amount"
            value={Number(kpiData[0]?.totalAmount)}
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