"use client"
import Header from "@/components/header";
import AppSidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useClockify } from "@/context/clockifyContext/ClockifyContext";

export default function DashboardLayout({ children }) {
    const{clockifyUserData}=useClockify()
  return (
    <SidebarProvider>
      <AppSidebar userName={clockifyUserData?.full_name}/>
      <main className="w-full">
        <Header />

        {children}
      </main>
    </SidebarProvider>
  );
}
