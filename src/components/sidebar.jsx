"use client";
import { useLogout } from "@/app/api/auth/logout";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import {
  ChevronRight,
  ChevronUp,
  CircleUser,
  Clock,
  CreditCard,
  DollarSign,
  FolderClock,
  History,
  Home,
  LineChart,
  Package,
  PieChart,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CompanyIcon } from "./companyicon";
// Menu items
export const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-4 w-4" />,
  },
  {
    label: "Punch Clock",
    href: "/dashboard/clockify",
    icon: <PieChart className="h-4 w-4" />,
    subItems: [
      {
        label: "General",
        href: "/dashboard/clockify/general",
        icon: <FolderClock className="h-4 w-4" />,
      },
      {
        label: "History",
        href: "/dashboard/clockify/history",
        icon: <History className="h-4 w-4" />,
      }]
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
    subItems: [
      {
        label: "General",
        href: "/dashboard/employees/general",
        icon: <UserCheck className="h-4 w-4" />,
      },
      {
        label: "Leave Request",
        href: "/dashboard/employees/leave-request",
        icon: <Clock className="h-4 w-4" />,
      },
      
    ],
  },
];


export default function AppSidebar({userName}) {
  const logout = useLogout();
  const theme = useTheme();
  const handleLogout = () => {
    logout();
  };
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname.startsWith(href + "/") || pathname === href;
  };

  const isParentActive = (item) => {
    return (
      item.subItems && item.subItems.some((subItem) => isActive(subItem.href))
    );
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="dark:bg-[#0E1525] bg-muted/40">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="mb-5 mt-2 ">
                <SidebarMenuButton asChild className="hover:bg-transparent">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 font-semibold"
                  >
                    <CompanyIcon
                      // size={30}
                      // color="#1169C4"
                      className="min-h-5 min-w-5"
                    />
                    <span className="text-xl">Avinto AS</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                        <CollapsibleContent className={``}>
                          <SidebarMenu>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuItem key={subItem.label}>
                                <SidebarMenuButton asChild className={`   ${
                                    isActive(subItem.href) || isParentActive(subItem)
                                      ? "bg-muted text-primary"
                                      : "text-muted-foreground hover:text-primary"
                                  }`}>
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
                      // <SidebarMenuButton asChild >
                      <SidebarMenuButton asChild className={`  ${
                            isActive(item.href)
                              ? "bg-muted text-primary"
                              : "hover:text-primary"
                              // : "text-muted-foreground hover:text-primary"
                          }`}>
                        <a href={item.href}>
                          {item.icon}
                          <span className="">{item.label}</span>
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
      <SidebarFooter className="dark:bg-[#0E1525]">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                {userName}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                {/* <DropdownMenuItem>
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Support</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
