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
