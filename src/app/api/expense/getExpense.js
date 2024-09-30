"use client";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access_token");


export const getExpenses = async (startDate,endDate) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expense/?start_date=${startDate}&end_date=${endDate}`, {
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

  


export const addExpense = async (expense) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expense/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  }).then((res) => res.json());
};
   

// export const addExpense = async (expense) => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expense/`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(expense), 
//       });
    
//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }
    
//       return await res.json(); 
//     } catch (error) {
//       console.error("Error adding expense:", error);
//       throw error; 
//     }
//   };
   
  