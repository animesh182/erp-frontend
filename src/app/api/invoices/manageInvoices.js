"use client";
import Cookies from "js-cookie";

const accessToken = Cookies.get("access_token");

export const updateInvoice = async (InvoiceData) => {

    if (!InvoiceData || !InvoiceData.id) {
      throw new Error("Invoice ID is missing");
    }
  
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${InvoiceData.id}/`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(InvoiceData),
    }).then((res) => res.json());
  };