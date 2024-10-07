"use client";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access_token");

export const getProjectById = async (projectId) => {
  console.log("Fetching project with ID:", projectId); 
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project/${projectId}/`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      return await res.json(); 
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  