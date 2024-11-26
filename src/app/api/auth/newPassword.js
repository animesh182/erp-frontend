import { apiClient } from "@/lib/utils";
import Cookies from "js-cookie";
export async function createNewPassword(formData) {
    const { email, password } = formData;
    const new_password=password
  
    try {
      const response = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/set_new_password/`,
        {
          method: "POST",
          body: JSON.stringify({ email, new_password }),
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,  
          },
        }
      );
  
      return { status: 200, message: "Password set successfully" };
    } catch (error) {
      throw new Error(error.message || "Failed to set password");
    }
  }