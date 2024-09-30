"use client";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access_token");


export const getTransactions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoices/`, {
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
  