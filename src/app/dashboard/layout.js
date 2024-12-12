import Header from "@/components/header";
import AppSidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Header />

        {children}
      </main>
    </SidebarProvider>
  );
}
