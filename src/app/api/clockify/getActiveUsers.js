
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

// function transformTimerEntryData(data, { users, clockifyTimeEntryProp, clockifyProjects }) {
function transformTimerEntryData(data, { users, clockifyUserData, clockifyProjects }) {
  if (!data?.length) return null;

  // const filteredData = data.filter(
  //   (user) => users.some(
  //     // (u) => u.userName === clockifyTimeEntryProp.userName &&
  //     (u) => u.userName === clockifyUserData.full_name &&
  //       u.userId === user.userId
  //   )
  // );

    const filteredData = data.filter(
    (user) => user.userId === clockifyUserData.clockify_user_id
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

// function transformUserListData(data, { employeeClockifyDetails, clockifyProjects }) {
function transformUserListData(data, { employeeClockifyDetails, clockifyProjects }) {
  if (!data?.length) return null;
  console.log(data,"ddsssdd")
  console.log(employeeClockifyDetails,"detailss")
  return data
    .map((user) => {
      const matchedUser = employeeClockifyDetails.find((u) => u.userId === user.userId);
      const matchedProjects = clockifyProjects.find((project) => project.projectId === user.projectId);

      return {
        user_name: matchedUser?.userName || "Unknown User",
        user_email: matchedUser?.userEmail || "Unknown User",
        latest_activity: user.description || "(no description)",
        project_name: matchedProjects?.projectName || "(Without project)",
        time: user.timeInterval.start,
        status: "Ongoing",
        user_id:user.userId
      };
    })
    .sort((a, b) => new Date(b.time) - new Date(a.time));
}

export { ACTIVE_USERS_TYPES };