export async function getActiveUsers(items) {
    try {
      const response = await fetch(
        `https://api.clockify.me/api/v1/workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/time-entries/status/in-progress?page-size=${items}`,
        {
          method: 'GET',
          headers: {
            'X-Api-Key': process.env.NEXT_PUBLIC_CLOCKIFY_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch active users: ${response.status}`);
      }
      const projects = await response.json();
      
   
      return projects;
    } catch (error) {
      console.error("Error fetching active users:", error);
      throw new Error("Failed to fetch active users");
    }
  }
