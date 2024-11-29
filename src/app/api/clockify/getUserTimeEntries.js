
    
    
    
    import { toast } from "sonner";
export async function findUserByEmailOrName(userData) {
    try {
      const response = await fetch(
        `https://api.clockify.me/api/v1/workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/users`,
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
  
      const users = await response.json();
  
      // First, try to match by email
      let matchedUser = users.find(user => user.email === userData.email);
      
      // If no match by email, try to match by name
      if (!matchedUser) {
        matchedUser = users.find(user => user.name === userData.name);
      }
  
      return matchedUser ? matchedUser.id : null;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }


  export const fetchTimeEntries = async (userData,clockifyDate) => {
    try {
      // Find user ID based on email or name
      const userId = await findUserByEmailOrName(userData);
  
      if (userId) {
        // Fetch time entries for the matched user ID
        const timeEntriesResponse = await fetch(
          `https://api.clockify.me/api/v1/workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/user/${userId}/time-entries?start=${clockifyDate}`,
          {
            method: 'GET',
            headers: {
              'X-Api-Key': process.env.NEXT_PUBLIC_CLOCKIFY_API_KEY,
              'Content-Type': 'application/json',
            },
          }
        );
  
        if (!timeEntriesResponse.ok) {
          throw new Error(`Failed to fetch time entries with status: ${timeEntriesResponse.status}`);
        }
  
        const clockifyData = await timeEntriesResponse.json();
        console.log("Clockify Time Entries:", clockifyData);
        return clockifyData;
      } else {
        toast.error("User not found by email or name")
        return null;
      }
    } catch (error) {
      console.error("Error fetching Clockify data:", error);
    }
  };
  