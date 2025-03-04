"use client"
import Header from "@/components/header";
import AppSidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useClockify } from "@/context/clockifyContext/ClockifyContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function DashboardLayout({ children }) {
    const{clockifyUserData}=useClockify()
    const queryclient= new QueryClient();
  return (
    <SidebarProvider>
      <AppSidebar userName={clockifyUserData?.full_name}/>
      <main className="w-full overflow-auto">
        <Header />
        <QueryClientProvider client={queryclient}>
        {children}
        </QueryClientProvider>
      </main>
    </SidebarProvider>
  );
}
