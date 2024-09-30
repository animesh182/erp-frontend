"use client";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access_token");

export const getPayroll = async () => {
    try {
      const res = await fetch(`https://erp-avinto.calmmoss-6f594ba1.norwayeast.azurecontainerapps.io//api/payroll/`, {
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
  