export const getTimeEntryById = async (id) => {
    try {
        const response = await fetch(
            `https://api.clockify.me/api/v1/workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/time-entries/${id}`,
            {
                method: 'GET',
                headers: {
                  'X-Api-Key': process.env.NEXT_PUBLIC_CLOCKIFY_API_KEY,
                  'Content-Type': 'application/json',
                },
              }
            );
        
            if (!response.ok) {
              throw new Error(`Failed to fetch time entry: ${response.status}`);
            }
            const timeEntry = await response.json();
            
         
            return timeEntry;
          } catch (error) {
            console.error("Error fetching time entry:", error);
            throw new Error("Failed to fetch time entry");
          }
        }



