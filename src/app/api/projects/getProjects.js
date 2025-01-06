import { apiClient } from "@/lib/utils";

export async function getProjects() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/project`,
      {
        method: "GET",
      }
    );
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch projects");
  }
}




export async function getClockifyIdProjectsss(getAllProjects=false) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/project/project_clockify_id_list/`,
      {
        method: "GET",
      }
    );

    if (getAllProjects) {
      return response.data.map((project) => ({
        projectId: project.clockify_id,
        projectName: project.name,
      }));
    }
    const projectsById = new Map();

    response.data.forEach((project) => {
      if (!projectsById.has(project.clockify_id)) {
        projectsById.set(project.clockify_id, [project]);
      } else {
        projectsById.get(project.clockify_id).push(project);
      }
    });


 const formattedData = Array.from(projectsById.values()).map((projects) => {
      if (projects.length > 1) {
        const firstName = projects[0].name.split(" ")[0];
        return {
          projectId: projects[0].clockify_id,
          projectName: firstName,
        };
      } else {
        return {
          projectId: projects[0].clockify_id,
          projectName: projects[0].name,
        };
      }
    });

    return formattedData;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch projects with clockify id");
  }
}

export async function getClockifyIdProjects() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/project/project_clockify_id_list/`,
      {
        method: "GET",
      }
    );
    return response.data; // Just return raw data
  } catch (error) {
    throw new Error(error.message || "Failed to fetch projects with clockify ID");
  }
}




export async function getProjectDetails(startDate, endDate) {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/project/`;
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await apiClient(url);

    return { status: 200, data: response.data };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch the project details",
    };
  }
}


export async function getProjectById(projectId, startDate, endDate) {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/project/${projectId}/`;
    // If startDate and endDate are provided, include them in the URL
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }
    const response = await apiClient(url);
    return { status: 200, data: response };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || `Failed to fetch project with ID ${projectId}`,
    };
  }
}


export async function getUserProjectById(projectId) {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user_projects/?project_id=${projectId}`
    );

    // Return the response directly since it's not wrapped in a `data` field
    return { status: 200, data: response };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || `Failed to fetch project with ID ${projectId}`,
    };
  }
}
