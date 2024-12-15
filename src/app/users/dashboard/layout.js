"use client"
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/UserSideBar";
import { useClockify } from "@/context/clockifyContext/ClockifyContext";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


export default function DashboardLayout({children}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserDashboardLayout >{children}</UserDashboardLayout>
    </Suspense>
  );
}

function UserDashboardLayout({ children }) {
// export default function DashboardLayout({ children }) {
    
  const searchParams = useSearchParams(); 
   
  
  const userId=searchParams.get('userId') 
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
