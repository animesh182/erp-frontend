

"use client"
import { useClockify } from "@/components/ClockifyContext";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/UserSideBar";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserDashboardContent>{children}</UserDashboardContent>
    </Suspense>
  );
}

function UserDashboardContent({ children }) {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const{clockifyUserData}=useClockify()
  return (
      <SidebarProvider>
      <AppSidebar userId={userId} userName={clockifyUserData?.full_name}/>
        <main className="w-full">
          <Header />
  
          {children}
        </main>
      </SidebarProvider>
  );
}
