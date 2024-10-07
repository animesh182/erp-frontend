"use client";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access_token");

export const getPayrollGenerate = async () => {

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate_employee_excel/`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.blob(); // Get the response as a Blob for binary data
  } catch (error) {
    console.error("Error fetching payroll:", error);
    throw error; // Rethrow the error to be handled by React Query
  }
};
export const getPayroll = async () => {

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoiced_salary/`, {
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




export const generatePayroll = async (formData) => {
  

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoiced_salary/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      // No need to set 'Content-Type' when using FormData; the browser sets it automatically
    },
    body: formData,
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  });
};


export const updatePayroll= async (PayrollData) => {

  if (!PayrollData || !PayrollData.id) {
    throw new Error("Payroll ID is missing");
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoiced_salary/${PayrollData.id}/`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(PayrollData),
  }).then((res) => res.json());
};
   
  

  
export const deletePayroll = async(payrollId) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoiced_salary/${payrollId}`, {
    method: "DELETE",
    headers:{
      "Authorization": `Bearer ${accessToken}`,
    },
  }).then(() => payrollId);
};
