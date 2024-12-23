"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


export default function DashboardLayout({ children }) {
  const queryclient= new QueryClient();
    return (
     <>
      <QueryClientProvider client={queryclient}>
       {children}
       </QueryClientProvider>
     </>
      );
    }
    
