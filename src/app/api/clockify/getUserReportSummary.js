
const REPORT_TYPES = {
    INACTIVE_USERS: 'inactiveUsers',
    PROJECT_SUMMARY: 'projectSummary',
    DETAILED_ENTRIES: 'detailedEntries'
};
  
export async function getUserReportSummary(start, end, pageSize=1000, messageType) {
    const safePageSize = pageSize > 1000 ? 1000 : pageSize;
    let allEntries = [];
    let page = 1;
    let lastUserDetails = null;

    try {
        while (true) {
            const response = await fetch(
                `https://reports.api.clockify.me/v1/workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/reports/detailed`,
                {
                    method: 'POST',
                    headers: {
                        'X-Api-Key': process.env.NEXT_PUBLIC_CLOCKIFY_API_KEY,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        dateRangeStart: start || "2024-11-11T00:00:00Z",
                        dateRangeEnd: end || "2024-11-19T23:59:59Z",
                        detailedFilter: {
                            groups: ["USER"],
                            pageSize: safePageSize,
                            page: page
                        },
                        sortColumn: "DURATION",
                        rounding: false,
                        amountShown: "HIDE_AMOUNT"
                    }),
                }
            );
    
            if (!response.ok) {
                throw new Error(`Failed to fetch user detail with status: ${response.status}`);
            }
            
            const userDetails = await response.json();
            lastUserDetails = userDetails;
      
            // If no time entries, we've reached the end
            if (!userDetails.timeentries || userDetails.timeentries.length === 0) {
                break;
            }
            
            // Accumulate entries
            allEntries = allEntries.concat(userDetails.timeentries);
            // Check if we've fetched fewer entries than the page size, indicating last page
            if (userDetails.timeentries.length < safePageSize) {
                break;
            }
            
            page++;
        }
        // Create a comprehensive result object
        const combinedUserDetails = {
            timeentries: allEntries,
            totals: lastUserDetails?.totals || null
        }
        
        // Transform data based on messageType
        switch (messageType) {
            case REPORT_TYPES.INACTIVE_USERS:
                return transformInactiveUsersData(combinedUserDetails);
            case REPORT_TYPES.PROJECT_SUMMARY:
                return transformProjectSummaryData(combinedUserDetails);
            case REPORT_TYPES.DETAILED_ENTRIES:
                return transformDetailedEntriesData(combinedUserDetails);
            default:
                return combinedUserDetails;
        }
    } catch (error) {
        console.error("Error fetching user detail:", error);
        throw new Error("Failed to fetch user detail");
    }
}




function transformInactiveUsersData(data) {
    if (!data?.timeentries?.length) return null;
    
    const latestUserData = data.timeentries.reduce((acc, inactiveUser) => {
        const userId = inactiveUser.userId || inactiveUser.userName;
        if (!acc[userId] || new Date(inactiveUser.timeInterval.end) > new Date(acc[userId].timeInterval.end)) {
            acc[userId] = inactiveUser;
    }
    return acc;
    }, {});
    return {
        timeentries: Object.values(latestUserData).map((inactiveUser) => ({
        user_name: inactiveUser.userName,
        user_email: inactiveUser.userEmail,
        latest_activity: inactiveUser.description || "(no description)",
        project_name: inactiveUser.projectName,
        time: formatMillisecondsToHourDifference(new Date(inactiveUser.timeInterval.start), new Date(inactiveUser.timeInterval.end)), // Initial duration
        status: formatTimeAgo(inactiveUser.timeInterval.start),
        user_id:inactiveUser.userId
    }))
};
}

function transformProjectSummaryData(data) {
    if (!data?.timeentries?.length) return null;
    const userProjectsMap = {};
    data.timeentries.forEach((entry) => {
        const { userName, projectName, projectColor, timeInterval,userId } = entry;
        const duration = timeInterval.duration;
        
        if (!userProjectsMap[userName]) {
            userProjectsMap[userName] = {
            userName,
            userId,
            projects: [],
        };
    }

    const existingProject = userProjectsMap[userName].projects.find(
        (project) => project.projectName === projectName
    );
    
    if (existingProject) {
        existingProject.duration += duration;
        existingProject.count += 1;
    } else {
        userProjectsMap[userName].projects.push({
            projectName,
            projectColor,
            duration,
            count: 1
        });
    }
    });
    return Object.values(userProjectsMap);
}

function transformDetailedEntriesData(data) {
    if (!data) return null;
    return {
        totals: data.totals,
        timeentries: data.timeentries?.map(users => ({
            latest_activity: users.description || "(no description)",
            name: users.userName,
            user_email: users.userEmail,
            projectName: users.projectName,
            start_time: users.timeInterval.start,
            end_time: users.timeInterval.end,
            duration: users.timeInterval.duration,
            project_color: users.projectColor,
        }))
    };
}

export { REPORT_TYPES };

function formatMillisecondsToHourDifference(startTime, endTime) {
    const timeDifference = new Date(endTime) - new Date(startTime);
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
    // Format in hh:mm:ss
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }



  function formatTimeAgo(endTime) {
    const currentTime = new Date();
    const endDate = new Date(endTime);
    const timeDifference = endDate - currentTime;
    
    // If timeDifference is positive, it's a future date
    if (timeDifference > 0) {
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
            return days === 1 ? "in 1 day" : `in ${days} days`;
        } else if (hours > 0) {
            return hours === 1 ? "in 1 hour" : `in ${hours} hours`;
        } else if (minutes > 0) {
            return minutes === 1 ? "in 1 minute" : `in ${minutes} minutes`;
        } else {
            return seconds === 1 ? "in 1 second" : `in ${seconds} seconds`;
        }
    }
    

    const seconds = Math.abs(Math.floor(timeDifference / 1000));
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



export const fetchUserReportSummaryy = async (start, end, page = 1) => {
    console.log(`Fetching page ${page}`);
    
    const response = await fetch(
        `https://reports.api.clockify.me/v1/workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/reports/detailed`,
        {
            method: 'POST',
            headers: {
                'X-Api-Key': process.env.NEXT_PUBLIC_CLOCKIFY_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dateRangeStart: start || "2024-11-11T00:00:00Z",
                dateRangeEnd: end || "2024-11-19T23:59:59Z",
                detailedFilter: {
                    groups: ["USER"],
                    pageSize: 1000, // Fixed page size due to API limitation
                    page: page
                },
                sortColumn: "DURATION",
                rounding: false,
                amountShown: "HIDE_AMOUNT"
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch user detail with status: ${response.status}`);
    }

    const data = await response.json();
    return {
        ...data,
        currentPage: page
    };
};


    export const fetchTotalCount = async (start, end) => {
        const response = await fetch(
            `https://reports.api.clockify.me/v1/workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/reports/detailed`,
            {
                method: 'POST',
                headers: {
                    'X-Api-Key': process.env.NEXT_PUBLIC_CLOCKIFY_API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dateRangeStart: start || "2024-11-11T00:00:00Z",
                    dateRangeEnd: end || "2024-11-19T23:59:59Z",
                    detailedFilter: {
                        groups: ["USER"],
                        pageSize: 1,  // Minimum size to get totals
                        page: 1
                    },
                    sortColumn: "DURATION",
                    rounding: false,
                    amountShown: "HIDE_AMOUNT"
                }),
            }
        );
    
        if (!response.ok) {
            throw new Error(`Failed to fetch total count with status: ${response.status}`);
        }
    
        const data = await response.json();
        return data.totals?.entriesCount || 0;
    };
    