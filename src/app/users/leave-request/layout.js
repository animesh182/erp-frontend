

"use client"
import Header from "@/components/header";
import Sidebar from "@/components/UserSideBar";
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

  return (
    <div>
      <main>
        <div className="lg:grid md:grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="overflow-hidden ">
            <Sidebar userId={userId} />
          </div>
          <div className="flex flex-col">
            <Header />
          
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
