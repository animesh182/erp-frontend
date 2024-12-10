import { apiClient } from "@/lib/utils";
import Cookies from "js-cookie";

export async function login(formData) {
  const { email, password } = formData;

  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/login/`,
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    const { access_token, refresh_token, is_employee,is_admin,user_details,first_time_login,clockify_user_id,clockify_api_key} = response;
    if(access_token && refresh_token)
    // Set the access token cookie using js-cookie
    {
      Cookies.set("access_token", access_token, {
      expires: 7, // 1 week
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // Set the refresh token cookie using js-cookie
    Cookies.set("refresh_token", refresh_token, {
      expires: 30, // 30 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })}

    return { status: 200, message: "Logged In Successfully" ,is_employee,is_admin,user_details,first_time_login,clockify_user_id,clockify_api_key};
  } catch (error) {
    // Clear the tokens if login fails (invalid credentials)
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("refresh_token", { path: "/" });

    return {
      status: 401,
      message: error.message || "Invalid credentials",
    };
  }
}
