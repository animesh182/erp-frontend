"use client";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access_token");



export const addClient = async(clientData) => {
    if (!clientData) {
      throw new Error("Client data is missing");
    }
  
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/client/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    }).then((res) => res.json());
  };
