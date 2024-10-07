"use client";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access_token");

export const getEmployees = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/employee-details/`, {
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


  export const updateEmployee = async (EmployeeData) => {
console.log(EmployeeData,"getEmployees")
    if (!EmployeeData || !EmployeeData.employee_id) {
      throw new Error("Employee ID is missing");
    }
  
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/employee-details/${EmployeeData.employee_id}/`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(EmployeeData),
    }).then((res) => res.json());
  };



  export const deleteEmployee = async(employeeId) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/employee-details/${employeeId}/`, {
      method: "DELETE",
      headers:{
        "Authorization": `Bearer ${accessToken}`,
      },
    }).then(() => employeeId);
  };
  