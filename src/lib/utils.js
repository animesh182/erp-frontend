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

export async function changeApprovalStatus(url, status, options = {}) {
  let token = Cookies.get("access_token"); // Get the access token from cookies

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // Add Authorization header if token exists
  };

  try {
    // Attempt to make the PUT request to change the status
    let response = await fetch(url, {
      ...options,
      method: "PUT",
      headers: {
        ...defaultHeaders,
        ...options.headers, // Merge additional headers if provided
      },
      body: JSON.stringify({ status }), // Set the new status in the request body
    });

    // If the token is invalid or expired, try to refresh it
    if (response.status === 401) {
      const errorData = await response.json();
      if (errorData.code === "token_not_valid") {
        // Try refreshing the token
        token = await refreshToken();
        // Retry the PUT request with the new token
        response = await fetch(url, {
          ...options,
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });
      }
    }

    // If the response is successful, return true
    if (response.ok) {
      return true;
    }

    // If the response is not successful, throw an error
    const errorData = await response.json();
    throw new Error(
      errorData.message || "An error occurred while updating status"
    );
  } catch (error) {
    console.error("API Status Change Request Failed:", error.message);
    throw new Error(
      error.message ||
        "An error occurred while processing the status change request"
    );
  }
}



// export const formatClockifyDate = (date) => {
//   console.log(date,"dateat")
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
//   const day = String(date.getDate()).padStart(2, "0");
//   const time = "T00:00:00Z";
//   return `${year}-${month}-${day}${time}`;
// };
export const formatClockifyDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
};



export const formatDuration = (durationInSeconds) => {
  const hours = Math.floor(durationInSeconds / 3600).toString().padStart(2, "0");
          const minutes = Math.floor((durationInSeconds % 3600) / 60)
            .toString()
            .padStart(2, "0");
          const seconds = (durationInSeconds % 60).toString().padStart(2, "0");
          return `${hours}:${minutes}:${seconds}`;
};


export function convertDateToTime(timestamp) {
  const date = new Date(timestamp);

  // Extract hours, minutes, and seconds
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function convertTimeToDate(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const currentDate = new Date();
  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);
  currentDate.setSeconds(0); // Optionally set seconds to 0
  currentDate.setMilliseconds(0); // Optionally set milliseconds to 0

  return currentDate;
}





export const validateDateRange = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  const oneYearInMs = 365 * 24 * 60 * 60 * 1000;

  const errors = [];
  
  if (end - start > oneYearInMs) {
    errors.push("Date range cannot exceed one year.");
  }
  
  if (start > now) {
    errors.push("Start date cannot be in the future.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};