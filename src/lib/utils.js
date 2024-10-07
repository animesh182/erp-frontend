import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// format the amount in Norwegian kroner
export function formatAmountToNOK(amount) {
  if (!amount) return "-";
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatAmountDecimalToNOK(amount) {
  if (!amount) return "-";
  return new Intl.NumberFormat("nb-NO", {
    style: "decimal",
  }).format(amount);
}

export function prettifyText(text) {
  // Handle kebab-case
  text = text.replace(/-/g, " ");

  // Handle camelCase
  text = text.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Capitalize first letter of each word
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export async function apiClient(url, options = {}) {
  const token = Cookies.get("access_token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return await response.json();
}


//Get YYYY-MM-DD format

export const formatDateApiFormat = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; 
};
