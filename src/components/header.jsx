"use client";
import React from "react";
import MobileSidebar from "./mobilesidebar";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { CircleUser, Search } from "lucide-react";
import { ModeToggle } from "./modetoggle";
import Link from "next/link";
import { useLogout } from "@/app/api/auth/logout";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  // const logout = useLogout();

  // // const handleLogout = () => {
  // //   logout();
  // // };

  return (
    <header className="flex bg-muted-40 h-14 items-center justify-between px-4 lg:h-[60px] lg:px-6">
      {/* <MobileSidebar /> */}
      <SidebarTrigger className="" />
      <ModeToggle />
      {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/settings">
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
    </header>
  );
}
