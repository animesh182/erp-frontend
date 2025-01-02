"use client"
import { fetchUserReportSummaryy,fetchUserReportSummary, fetchTotalCount, getUserReportSummary } from "@/app/api/clockify/getUserReportSummary";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";






const REPORT_TYPES = {
    INACTIVE_USERS: 'inactiveUsers',
    PROJECT_SUMMARY: 'projectSummary',
    DETAILED_ENTRIES: 'detailedEntries'
};

export function useUserReportSummary({ start, end, pageSize, messageType ,isValid}) {

    return useQuery({
        queryKey: ["userReportSummary", start, end, pageSize, messageType],
            queryFn: async () => {
                const response = await getUserReportSummary(start, end, pageSize, messageType)
                if(response)
                    return response
            },
        enabled: !!start && !!end && isValid,
        onError: (error) => console.error("Error in useQuery:", error),
    });
}








    //     export const useUserReportSummaryy = (start, end, type) => {
    //         // First, get the total count
    //         const totalCountQuery = useQuery({
    //             queryKey: ['totalCount', start, end],
    //             queryFn: () => fetchTotalCount(start, end),
    //             staleTime: 300000, // 5 minutes
    //         });
        
    //         // Then fetch the data with pagination
    //         const dataQuery = useInfiniteQuery({
    //             queryKey: ['userReportSummary', start, end, type],
    //             queryFn: ({ pageParam = 1 }) => fetchUserReportSummaryy(start, end, pageParam),
    //             enabled: !!totalCountQuery.data,
    //             initialData: {
    //                 pages: [],
    //                 pageParams: []
    //             },
    //             getNextPageParam: (lastPage, allPages) => {
    //                 const totalFetched = allPages.reduce((total, page) => 
    //                     total + (page.timeentries?.length || 0), 0);
                    
    //                 console.log('Pagination status:', {
    //                     totalFetched,
    //                     totalExpected: totalCountQuery.data,
    //                     currentPage: lastPage?.currentPage || 0
    //                 });
        
    //                 if (totalFetched < totalCountQuery.data) {
    //                     return (lastPage?.currentPage || 0) + 1;
    //                 }
    //                 return undefined;
    //             },
    //             select: (data) => {
    //                 if (!data?.pages?.length) {
    //                     return {
    //                         timeentries: [],
    //                         totals: null
    //                     };
    //                 }
        
    //                 const combinedData = {
    //                     timeentries: data.pages.flatMap(page => page?.timeentries || []),
    //                     totals: data.pages[data.pages.length - 1]?.totals || null
    //                 };
        
    //                 console.log("Combined data length:", combinedData.timeentries.length);
        
    //                 switch (type) {
    //                     case REPORT_TYPES.INACTIVE_USERS:
    //                         return {
    //                             timeentries: transformInactiveUsersData(combinedData)?.timeentries || [],
    //                             totals: combinedData.totals
    //                         };
    //                     case REPORT_TYPES.PROJECT_SUMMARY:
    //                         return {
    //                             timeentries: transformProjectSummaryData(combinedData),
    //                             totals: combinedData.totals
    //                         };
    //                     case REPORT_TYPES.DETAILED_ENTRIES:
    //                         return {
    //                             timeentries: transformDetailedEntriesData(combinedData) || [],
    //                             totals: combinedData.totals
    //                         };
    //                     default:
    //                         return combinedData;
    //                 }
    //             },
    //         });
        
    //         // Auto-fetch next page
    //         useEffect(() => {
    //             if (dataQuery.hasNextPage && !dataQuery.isFetchingNextPage) {
    //                 console.log('Auto-fetching next page');
    //                 dataQuery.fetchNextPage();
    //             }
    //         }, [dataQuery.hasNextPage, dataQuery.isFetchingNextPage]);
        
    //         return {
    //             data: {
    //                 timeentries: dataQuery.data?.timeentries || [],
    //                 totals: dataQuery.data?.totals || null
    //             },
    //             isLoading: totalCountQuery.isLoading || dataQuery.isLoading,
    //             isFetching: totalCountQuery.isFetching || dataQuery.isFetching,
    //             isError: totalCountQuery.isError || dataQuery.isError,
    //             error: totalCountQuery.error || dataQuery.error,
    //             totalCount: totalCountQuery.data || 0,
    //             hasNextPage: dataQuery.hasNextPage,
    //             isFetchingNextPage: dataQuery.isFetchingNextPage
    //         };
    //     };






    // function transformInactiveUsersData(data) {
    //     if (!data?.timeentries?.length) return null;
        
    //     const latestUserData = data.timeentries.reduce((acc, inactiveUser) => {
    //         const userId = inactiveUser.userId || inactiveUser.userName;
    //         if (!acc[userId] || new Date(inactiveUser.timeInterval.end) > new Date(acc[userId].timeInterval.end)) {
    //             acc[userId] = inactiveUser;
    //       }
    //       return acc;
    //     }, {});
    //     return {
    //         timeentries: Object.values(latestUserData).map((inactiveUser) => ({
    //         user_name: inactiveUser.userName,
    //         user_email: inactiveUser.userEmail,
    //         latest_activity: inactiveUser.description || "(no description)",
    //         project_name: inactiveUser.projectName,
    //         time: formatMillisecondsToHourDifference(new Date(inactiveUser.timeInterval.start), new Date(inactiveUser.timeInterval.end)), // Initial duration
    //         status: formatTimeAgo(inactiveUser.timeInterval.start),
    //         user_id:inactiveUser.userId
    //     }))
    // };
    // }
    
    // function transformProjectSummaryData(data) {
      
    //     if (!data?.timeentries?.length) return null;
    //     const userProjectsMap = {};
    //     data.timeentries.forEach((entry) => {
    //         const { userName, projectName, projectColor, timeInterval,userId } = entry;
    //         const duration = timeInterval.duration;
            
    //         if (!userProjectsMap[userName]) {
    //             userProjectsMap[userName] = {
    //           userName,
    //           userId,
    //           projects: [],
    //         };
    //     }
    
    //     const existingProject = userProjectsMap[userName].projects.find(
    //         (project) => project.projectName === projectName
    //     );
        
    //     if (existingProject) {
    //         existingProject.duration += duration;
    //         existingProject.count += 1;
    //     } else {
    //         userProjectsMap[userName].projects.push({
    //             projectName,
    //             projectColor,
    //             duration,
    //             count: 1
    //         });
    //     }
    //     });
    //     return Object.values(userProjectsMap);
    // }
    
    // function transformDetailedEntriesData(data) {
    //     if (!data) return null;
    //     return {
    //         totals: data.totals,
    //         timeentries: data.timeentries?.map(users => ({
    //             latest_activity: users.description || "(no description)",
    //             name: users.userName,
    //             user_email: users.userEmail,
    //             projectName: users.projectName,
    //             start_time: users.timeInterval.start,
    //             end_time: users.timeInterval.end,
    //             duration: users.timeInterval.duration,
    //             project_color: users.projectColor,
    //         }))
    //     };
    // }
    
    
    // function formatMillisecondsToHourDifference(startTime, endTime) {
    //     const timeDifference = new Date(endTime) - new Date(startTime);
    //     const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    //     const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    //     const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      
    //     // Format in hh:mm:ss
    //     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    //   }
    
    
    
    //   function formatTimeAgo(endTime) {
    //     const currentTime = new Date();
    //     const endDate = new Date(endTime);
    //     const timeDifference = endDate - currentTime;
        
    //     // If timeDifference is positive, it's a future date
    //     if (timeDifference > 0) {
    //         const seconds = Math.floor(timeDifference / 1000);
    //         const minutes = Math.floor(seconds / 60);
    //         const hours = Math.floor(minutes / 60);
    //         const days = Math.floor(hours / 24);
            
    //         if (days > 0) {
    //             return days === 1 ? "in 1 day" : `in ${days} days`;
    //         } else if (hours > 0) {
    //             return hours === 1 ? "in 1 hour" : `in ${hours} hours`;
    //         } else if (minutes > 0) {
    //             return minutes === 1 ? "in 1 minute" : `in ${minutes} minutes`;
    //         } else {
    //             return seconds === 1 ? "in 1 second" : `in ${seconds} seconds`;
    //         }
    //     }
        
    
    //     const seconds = Math.abs(Math.floor(timeDifference / 1000));
    //     const minutes = Math.floor(seconds / 60);
    //     const hours = Math.floor(minutes / 60);
    //     const days = Math.floor(hours / 24);
        
    //     if (days > 0) {
    //         return days === 1 ? "1 day ago" : `${days} days ago`;
    //     } else if (hours > 0) {
    //         return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    //     } else if (minutes > 0) {
    //         return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    //     } else {
    //         return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
    //     }
    // }
    

    // export { REPORT_TYPES };
