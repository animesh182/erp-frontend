"use client";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access_token");


export const getExpenses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expense/`, {
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
   

export const updateExpense= async (ExpenseData) => {

  if (!ExpenseData || !ExpenseData.id) {
    throw new Error("Expense ID is missing");
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expense/${ExpenseData.id}/`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ExpenseData),
  }).then((res) => res.json());
};
   
  
export const deleteExpense = async(expenseId) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expense/${expenseId}`, {
    method: "DELETE",
    headers:{
      "Authorization": `Bearer ${accessToken}`,
    },
  }).then(() => expenseId);
};
