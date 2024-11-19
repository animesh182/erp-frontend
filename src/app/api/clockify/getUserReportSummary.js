export async function getUserReportSummary(start,end,pageSize) {
    console.log(start,end,"start")
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
                    dateRangeStart:start || "2024-11-11T00:00:00Z",
                    dateRangeEnd: end || "2024-11-19T23:59:59Z",
                    detailedFilter: {
                        groups: ["USER"],
                        pageSize:  pageSize,
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
        return userDetails; 
        // return userDetails.timeentries; // Return raw data for processing
    } catch (error) {
        console.error("Error fetching user detail:", error);
        throw new Error("Failed to fetch user detail");
    }
}

