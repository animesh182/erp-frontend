import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
import { differenceInDays } from "date-fns";
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
export function getDifferenceInDays(startDate, endDate) {
  return differenceInDays(endDate, startDate);
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

// Function to refresh the access token using the refresh token
async function refreshToken() {
  try {
    const refreshToken = Cookies.get("refresh_token"); // Retrieve refresh token from cookies

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    // Set the new access token in cookies
    Cookies.set("access_token", data.access, { expires: 1 }); // Set the new token with expiration
    return data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

export async function apiClient(url, options = {}) {
  let token = Cookies.get("access_token");

  const defaultHeaders = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Only set Content-Type if the body is not FormData
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  try {
    let response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      const errorData = await response.json();
      if (errorData.code === "token_not_valid") {
        token = await refreshToken();
        response = await fetch(url, {
          ...options,
          headers: {
            ...defaultHeaders,
            Authorization: `Bearer ${token}`,
            ...options.headers,
          },
        });
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred");
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Failed:", error.message);
    throw new Error(
      error.message || "An error occurred while processing the request"
    );
  }
}

export async function deleteApiClient(url, options = {}) {
  let token = Cookies.get("access_token"); // Get the access token from cookies

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // Add Authorization header if token exists
  };

  try {
    // Attempt to make the DELETE request
    let response = await fetch(url, {
      ...options,
      method: "DELETE",
      headers: {
        ...defaultHeaders,
        ...options.headers, // Merge additional headers if provided
      },
    });

    // If the token is invalid or expired, try to refresh it
    if (response.status === 401) {
      const errorData = await response.json();
      if (errorData.code === "token_not_valid") {
        // Try refreshing the token
        token = await refreshToken();
        // Retry the DELETE request with the new token
        response = await fetch(url, {
          ...options,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }

    // Check for 204 status code (No Content)
    if (response.status === 204) {
      return true; // Successful deletion
    }

    // If the response is not 204, throw an error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred");
    }

    return false; // Should not reach here for successful deletion
  } catch (error) {
    console.error("API Delete Request Failed:", error.message);
    throw new Error(
      error.message || "An error occurred while processing the delete request"
    );
  }
}
