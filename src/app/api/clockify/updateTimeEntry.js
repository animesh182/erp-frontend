
export async function updateTimeEntry(savedTimeEntryId,timeEntry) {
    try {
      const response = await fetch(
        `https://api.clockify.me/api/v1/workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/time-entries/${savedTimeEntryId}`,
        {
          method: 'PUT',
          headers: {
              'X-Api-Key': "MjdjNTNkMGYtMjE5My00MzQ2LWFiNGEtMjEyY2RiMzI2MmIx",
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
  
      if (response.ok) {
        const data = await response.json();
        return data;
        // return data.message || "Time entry has been updated!";
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to update time entry");
      }
    } catch (error) {
      throw new Error(error.message || "Failed to update time entry");
    }
  }
  