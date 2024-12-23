"use client";
import { useLogout } from "@/app/api/auth/logout";
import { CircleUser } from "lucide-react";
import { usePathname } from "next/navigation";
import MobileSidebar from "./mobilesidebar";
import { ModeToggle } from "./modetoggle";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserMobileSidebar from "./UserMobileSideBar";

export default function Header() {
  const pathname = usePathname();
  const logout = useLogout();

  // // const handleLogout = () => {
  // //   logout();
  // // };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
     {pathname.includes("/users/") ? <UserMobileSidebar /> : <MobileSidebar />} 

      <div className="w-full flex-1">
        {/* <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form> */}
      </div>
    {/* <header className="flex bg-muted-40 h-14 items-center justify-between px-4 lg:h-[60px] lg:px-6"> */}
      {/* <MobileSidebar /> */}
      {/* <SidebarTrigger className="" /> */}
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
