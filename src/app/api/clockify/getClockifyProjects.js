export async function getClockifyProjects() {
    try {
      const response = await fetch(
        `https://api.clockify.me/api/v1/workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/projects`,
        {
          method: 'GET',
          headers: {
            'X-Api-Key': process.env.NEXT_PUBLIC_CLOCKIFY_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch users with status: ${response.status}`);
      }
      const projects = await response.json();
      
   
      return projects;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw new Error("Failed to fetch projects");
    }
  }


  export async function getClockifyProjectSummary() {
    try {
        const response = await fetch(
            `https://reports.api.clockify.me/v1/workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/reports/summary`,
            {
                method: 'POST',
                headers: {
                    'X-Api-Key': process.env.NEXT_PUBLIC_CLOCKIFY_API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dateRangeStart: "2024-11-11T00:00:00Z",
                    dateRangeEnd: "2024-11-17T23:59:59Z",
                    summaryFilter: {
                        groups: ["PROJECT"]
                    },
                    sortColumn: "DURATION"
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch project summary with status: ${response.status}`);
        }

        const projectSummary = await response.json();
        return projectSummary;
    } catch (error) {
        console.error("Error fetching project summary:", error);
        throw new Error("Failed to fetch project summary");
    }
}
