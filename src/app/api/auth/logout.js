"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    router.push("/");
    return { message: "Logout successful" };
  };

  return logout;
}
