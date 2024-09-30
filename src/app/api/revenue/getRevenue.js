"use client";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access_token");

export const getRevenue = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/revenue/`, {
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

  export const addRevenue = async(revenue) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/revenue/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(revenue),
    }).then((res) => res.json());
  };
  
  
export const deleteRevenue = async(revenueId) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/revenue/${revenueId}`, {
    method: "DELETE",
    headers:{
      "Authorization": `Bearer ${accessToken}`,
    },
  }).then(() => revenueId);
};


export const updateRevenue = async(revenue) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/revenue/${revenue.id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(revenue),
  }).then((res) => res.json());
};