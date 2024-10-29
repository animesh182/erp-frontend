import {
  Home,
  LineChart,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronRight, // Import ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { CompanyIcon } from "./companyicon";
import Link from "next/link";

// Menu items
export const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-4 w-4" />,
  },
  {
    label: "Finances",
    href: "/dashboard/finances",
    icon: <ShoppingCart className="h-4 w-4" />,
    subItems: [
      {
        label: "Transactions",
        href: "/dashboard/finances/transactions",
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        label: "Revenue",
        href: "/dashboard/finances/revenue",
        icon: <TrendingUp className="h-4 w-4" />,
      },
      {
        label: "Expenses",
        href: "/dashboard/finances/expenses",
        icon: <TrendingDown className="h-4 w-4" />,
      },
      {
        label: "Projection",
        href: "/dashboard/finances/projection",
        icon: <DollarSign className="h-4 w-4" />,
      },
      {
        label: "Payroll",
        href: "/dashboard/finances/payroll",
        icon: <LineChart className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: <Package className="h-4 w-4" />,
  },
  {
    label: "Employees",
    href: "/dashboard/employees",
    icon: <Users className="h-4 w-4" />,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <CompanyIcon size={24} color="#1169C4" />
              <span className="text-xl">Avinto AS</span>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <Collapsible
                  key={item.label}
                  asChild
                  defaultOpen={true}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {item.subItems ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            {item.icon}
                            <span>{item.label}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenu>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuItem key={subItem.label}>
                                <SidebarMenuButton asChild>
                                  <a href={subItem.href} className="pl-6">
                                    {subItem.icon}
                                    <span>{subItem.label}</span>
                                  </a>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton asChild>
                        <a href={item.href}>
                          {item.icon}
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
