// export async function getUserReportSummary() {
//     try {
//         const response = await fetch(
//             `https://reports.api.clockify.me/v1/workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/reports/detailed`,
//             {
//                 method: 'POST',
//                 headers: {
//                     'X-Api-Key': process.env.NEXT_PUBLIC_CLOCKIFY_API_KEY,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     dateRangeStart: "2024-11-11T00:00:00Z",
//                     dateRangeEnd: "2024-11-17T23:59:59Z",
//                     detailedFilter: {
//                         groups: ["USER"]
//                     },
//                     sortColumn: "DURATION"
//                 })
//             }
//         );

//         if (!response.ok) {
//             throw new Error(`Failed to fetch user detail with status: ${response.status}`);
//         }

//         const userDetails = await response.json();
//         return userDetails;
//     } catch (error) {
//         console.error("Error fetching user detail:", error);
//         throw new Error("Failed to fetch user detail");
//     }
// }


export async function getUserReportSummary() {
    try {
        const response = await fetch(
            `https://reports.api.clockify.me/v1/workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/reports/detailed`,
            {
                method: 'POST',
                headers: {
                    'X-Api-Key': process.env.NEXT_PUBLIC_CLOCKIFY_API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dateRangeStart: "2024-11-11T00:00:00Z",
                    dateRangeEnd: "2024-11-17T23:59:59Z",
                    detailedFilter: {
                        groups: ["USER"]
                    },
                    sortColumn: "DURATION"
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch user detail with status: ${response.status}`);
        }

        const userDetails = await response.json();

        // Process data to get only the latest entry per user based on id or name
        const latestUserData = userDetails.timeentries.reduce((acc, entry) => {
            const userId = entry.userId || entry.userName; // Use userId if available, otherwise fallback to userName
            if (!acc[userId] || new Date(entry.timeInterval.end) > new Date(acc[userId].timeInterval.end)) {
                acc[userId] = entry;
            }
            return acc;
        }, {});

        // Convert the object back to an array
        return Object.values(latestUserData);
    } catch (error) {
        console.error("Error fetching user detail:", error);
        throw new Error("Failed to fetch user detail");
    }
}
