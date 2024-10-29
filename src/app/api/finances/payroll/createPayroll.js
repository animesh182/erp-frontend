import Cookies from "js-cookie";

export async function createPayroll(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    let token = Cookies.get("access_token");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoiced_salary/`,
      {
        method: "POST",
        body: formData,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Content-Type is automatically set by the browser for FormData
        },
      }
    );

    if (response.status === 401) {
      const errorData = await response.json();
      if (errorData.code === "token_not_valid") {
        token = await refreshToken();
        return createPayroll(file); // Retry with new token
      }
    }

    if (response.status !== 201) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating payroll:", error);
    throw new Error(error.message || "Failed to create payroll");
  }
}

async function refreshToken() {
  try {
    const refreshToken = Cookies.get("refresh_token");

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
    Cookies.set("access_token", data.access, { expires: 1 });
    return data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}
