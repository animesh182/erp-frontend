
const ACTIVE_USERS_TYPES = {
  TIMER_ENTRY: 'timerEntry',
  USER_LIST: 'userList'
};

export async function getActiveUsers(items, type, additionalData = {}) {
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

    const activeUsers = await response.json();

    // Transform data based on type
    switch (type) {
      case ACTIVE_USERS_TYPES.TIMER_ENTRY:
        return transformTimerEntryData(activeUsers, additionalData);
      case ACTIVE_USERS_TYPES.USER_LIST:
        return transformUserListData(activeUsers, additionalData);
      default:
        return activeUsers;
    }
  } catch (error) {
    console.error("Error fetching active users:", error);
    throw new Error("Failed to fetch active users");
  }
}

function transformTimerEntryData(data, { users, clockifyTimeEntryProp, clockifyProjects }) {
  if (!data?.length) return null;

  const filteredData = data.filter(
    (user) => users.some(
      (u) => u.userName === clockifyTimeEntryProp.userName &&
        u.userId === user.userId
    )
  );

  if (filteredData.length === 0) return null;

  const activeUser = filteredData[0];
  const matchedProject = clockifyProjects.find(
    (project) => project.projectId === activeUser.projectId
  );

  return {
    timeEntryId: activeUser.id,
    description: activeUser.description || "",
    projectName: matchedProject?.projectName || "",
    billable: activeUser.billable,
    timeInterval: {
      start: activeUser.timeInterval.start,
      end: activeUser.timeInterval.end,
    },
    elapsedTime: !activeUser.timeInterval.end ? 
      Math.floor((new Date().getTime() - new Date(activeUser.timeInterval.start).getTime()) / 1000) :
      null
  };
}

function transformUserListData(data, { users, clockifyProjects }) {
  if (!data?.length) return null;

  return data
    .map((user) => {
      const matchedUser = users.find((u) => u.userId === user.userId);
      const matchedProjects = clockifyProjects.find((project) => project.projectId === user.projectId);

      return {
        user_name: matchedUser?.userName || "Unknown User",
        user_email: matchedUser?.userEmail || "Unknown User",
        latest_activity: user.description || "No data available",
        project_name: matchedProjects?.projectName || "Unknown Project",
        time: user.timeInterval.start,
        status: "Ongoing"
      };
    })
    .sort((a, b) => new Date(b.time) - new Date(a.time));
}

export { ACTIVE_USERS_TYPES };