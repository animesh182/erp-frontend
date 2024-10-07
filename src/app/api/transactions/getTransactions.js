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
  
      return await res.json(); 
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; 
    }
  };
  


  // export const updateTransactions = async (transactionData) => {
 
  
  //   if (!transactionData || !transactionData.id) {
  //     throw new Error("Transaction ID is missing");
  //   }
  
  //   return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${transactionData.id}/`, {
  //     method: "PATCH",
  //     headers: {
  //       "Authorization": `Bearer ${accessToken}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(transactionData),
  //   }).then((res) => res.json());
  // };


  export const deleteTransaction = async(transactionId) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${transactionId}`, {
      method: "DELETE",
      headers:{
        "Authorization": `Bearer ${accessToken}`,
      },
    }).then(() => transactionId);
  };
  