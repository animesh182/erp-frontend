import Header from "@/components/header";
import AppSidebar from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex items-center justify-between border-b bg-muted/40 ">
          <SidebarTrigger className="ml-5" />
          <Header />
        </div>

        {children}
      </main>
    </SidebarProvider>
  );
}
