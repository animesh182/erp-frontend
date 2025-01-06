import { ACTIVE_USERS_TYPES, fetchActiveUsers, fetchActiveUserss } from "@/app/api/clockify/getActiveUsers";
import { useQuery } from "@tanstack/react-query";

import { getActiveUsers } from "@/app/api/clockify/getActiveUsers";




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

    // export function useActiveUsers({ items, type, additionalData }) {
    //     return useQuery({
    //         queryKey: ["activeUsers", items, type, additionalData],
    //         queryFn: async () => {
    //             if (!items || !additionalData) {
    //             // if (!items || !additionalData?.employeeClockifyDetails || !additionalData?.clockifyProjects) {
    //                 throw new Error("Missing required data for fetching active users");
    //             }
    //             return await getActiveUsers(items, type, additionalData);
    //         },
    //         enabled: !!items && !!type && !!additionalData,
    //         // enabled: !!items && !!type && !!additionalData?.employeeClockifyDetails && !!additionalData?.clockifyProjects,
    //         onError: (error) => console.error("Error in useActiveUsers query:", error),
    //     });
    // }
    
    export function useActiveUsers({ items, type, additionalData }) {
        return useQuery({
            queryKey: ["activeUsers", items, type, additionalData],
            queryFn: async () => {
                if (!items || !additionalData) {
                    throw new Error("Missing required data for fetching active users");
                }
                return await getActiveUsers(items, type, additionalData);
            },
            enabled: !!items && !!type && isAdditionalDataValid(type, additionalData),
            onError: (error) => console.error("Error in useActiveUsers query:", error),
        });
    }
    
    function isAdditionalDataValid(type, additionalData) {
        if (type === ACTIVE_USERS_TYPES.TIMER_ENTRY) {
            return !!additionalData?.clockifyUserData && !!additionalData?.clockifyProjects;
        }
        if (type === ACTIVE_USERS_TYPES.USER_LIST) {
            return !!additionalData?.employeeClockifyDetails && !!additionalData?.clockifyProjects;
        }
        return false; // Default case for unsupported type
    }
    