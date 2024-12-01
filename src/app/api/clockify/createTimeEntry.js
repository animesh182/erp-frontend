import { toast } from "sonner";




export async function createTimeEntry(clockifyApiKey,timeEntry) {
  try {
    const response = await fetch(
      `https://api.clockify.me/api/v1/workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/time-entries`,
      {
        method: 'POST',
        headers: {
            'X-Api-Key': clockifyApiKey,
            // 'X-Api-Key': process.env.NEXT_PUBLIC_SANKALPA_CLOCKIFY_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: timeEntry.startTime || new Date().toISOString(),
          description: timeEntry.description,
          projectId: timeEntry.projectId,
          billable: timeEntry.billable !== undefined ? timeEntry.billable : true,
        }),
      }
    );

    // Assuming the response contains a message or success info, return it
    if (response.ok) {
      const data = await response.json();
      toast.success("Time entry created successfully!")
      return data 
      
    } else {
      const data = await response.json();
      toast("Failed to create time entry!")
      throw new Error(data.message || "Failed to create time entry");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to create time entry");
  }
}









export async function stopTimeEntry(userID,clockifyApiKey,endTime) {
  try {
    const response = await fetch(
      `https://api.clockify.me/api/v1/workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/user/${userID}/time-entries`,
      {
        method: 'PATCH',
        headers: {
            'X-Api-Key': clockifyApiKey,
            // 'X-Api-Key': process.env.NEXT_PUBLIC_SANKALPA_CLOCKIFY_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          end: endTime || "2024-11-21T14:00:00Z"
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.message || "Time entry has been created!";
    } else {
      const data = await response.json();
      throw new Error(data.message || "Failed to stop time entry");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to stop time entry");
  }
}


