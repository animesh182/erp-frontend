"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Home, Clock, ChevronDown, ChevronRight, CircleUser, ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { CompanyIcon } from "./companyicon";
import { useLogout } from "@/app/api/auth/logout";
import { useTheme } from "next-themes";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
// Navigation items
export const navItems = [
  {
    label: "Dashboard",
    href: "/users/dashboard",
    icon: <Home className="h-4 w-4" />,
  },
  {
    label: "Leave Request",
    href: "/users/leave-request",
    icon: <Clock className="h-4 w-4" />,
  },
];


export default function AppSidebar({ userId ,userName }) {
  const logout = useLogout();
  const theme = useTheme();
  const handleLogout = () => {
    logout();
  };
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/users") {
      return pathname === "/users" || pathname === "/users/";
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
                                  <a 
                                  href={`${subItem.href}?userId=${userId}`} 
                                  className="pl-6">
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
                      <SidebarMenuButton asChild className={`  ${
                            isActive(item.href)
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}>
                        <a 
                        href={`${item.href}?userId=${userId}`} 
                        >
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
