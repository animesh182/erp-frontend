import { fetchActiveUsers, fetchActiveUserss } from "@/app/api/clockify/getActiveUsers";
import { useQuery } from "@tanstack/react-query";

import { getActiveUsers } from "@/app/api/clockify/getActiveUsers";

    const transformTimerEntryData = (data, { clockifyUserData, clockifyProjects }) => {
        if (!data?.length || !clockifyUserData || !clockifyProjects) {
        console.error('Invalid input for transformTimerEntryData', { 
            dataLength: data?.length, 
            clockifyUserData, 
            clockifyProjectsLength: clockifyProjects?.length 
        });
        return null;
        }
    
        const filteredData = data.filter(
        (user) => user.userId === clockifyUserData.clockify_user_id
        );
    
        if (filteredData.length === 0) return null;
    
        const activeUser = filteredData[0];
        const matchedProject = clockifyProjects.find(
        (project) => project.projectId === activeUser.projectId || ""
        );
    
        return {
        timeEntryId: activeUser.id,
        description: activeUser.description || "",
        projectName: matchedProject?.projectName || "",
        billable: activeUser.billable,
        timeInterval: {
            start: activeUser.timeInterval.start,
            end: activeUser.timeInterval.end,
        },
        elapsedTime: !activeUser.timeInterval.end ? 
            Math.floor((new Date().getTime() - new Date(activeUser.timeInterval.start).getTime()) / 1000) :
            null
        };
    };
    
    const transformUserListData = (data, { employeeClockifyDetails, clockifyProjects }) => {
        if (!data?.length) return null;
        
        const validClockifyProjects = clockifyProjects.filter((project) => project.projectId);
        
        return data
        .map((user) => {
            const matchedUser = employeeClockifyDetails.find((u) => u.userId === user.userId);
            const matchedProjects = validClockifyProjects.find(
            (project) => project.projectId === user.projectId
            );
    
            return {
            user_name: matchedUser?.userName || "Unknown User",
            user_email: matchedUser?.userEmail || "Unknown User",
            latest_activity: user.description || "(no description)",
            project_name: matchedProjects?.projectName || "(Without project)",
            time: user.timeInterval.start,
            status: "Ongoing",
            user_id: user.userId
            };
        })
        .sort((a, b) => new Date(b.time) - new Date(a.time));
    };
    

    
    export const ACTIVE_USERS_TYPES = {
        TIMER_ENTRY: 'timerEntry',
        USER_LIST: 'userList'
    };
    
        export const useActiveUsers = (items, type, additionalData) => {
            return useQuery({
            queryKey: ['activeUsers', items, type, additionalData],
            queryFn: () => fetchActiveUserss(items),
            select: (data) => {
                switch (type) {
                case ACTIVE_USERS_TYPES.TIMER_ENTRY:
                    return transformTimerEntryData(data, additionalData);
                case ACTIVE_USERS_TYPES.USER_LIST:
                    return transformUserListData(data, additionalData);
                default:
                    return data;
                }
            },
            enabled: !!items && !!additionalData,
            });
        };






    // export const useActiveUsers = (items, type, additionalData) => {
    //     return useQuery({
    //     queryKey: ["activeUsers", { items, type, additionalData }],
    //     queryFn: async () => {
    //         const response = await getActiveUsers(items, type, additionalData);
    //         return response;
    //     },
    //     onError: (error) => {
    //         console.error("Error fetching active users:", error.message);
    //         throw new Error(error.message || "Failed to fetch active users");
    //     },
    //     });
    // };