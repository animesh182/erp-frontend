import Header from "@/components/header";
import Sidebar from "@/components/UserSideBar";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <main>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="overflow-hidden">
            <Sidebar />
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
