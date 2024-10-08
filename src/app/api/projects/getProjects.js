"use client";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access_token");

export const getProjects = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project/`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      return await res.json(); // Return the parsed JSON data
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error to be handled by React Query
    }
  };
  

  export const updateProjects = async (projectData) => {
  
  
    if (!projectData || !projectData.id) {
      throw new Error("Project ID is missing");
    }
  
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project/${projectData.id}/`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    }).then((res) => res.json());
  };



  export const deleteProject = async(projectId) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project/${projectId}/`, {
      method: "DELETE",
      headers:{
        "Authorization": `Bearer ${accessToken}`,
      },
    }).then(() => projectId);
  };
  


  export const addProject = async(projectData) => {
    if (!projectData) {
      throw new Error("Project is missing");
    }
  
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    }).then((res) => res.json());
  };
