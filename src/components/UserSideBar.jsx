"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Home, Clock, ChevronDown, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { CompanyIcon } from "./companyicon";

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


export default function Sidebar({ userId }) {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleExpand = (label) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

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
    <aside className="hidden md:fixed md:top-0 md:left-0 md:h-full md:w-[220px] lg:w-[280px] md:border-r md:bg-muted/40 md:block md:overflow-y-auto">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <CompanyIcon size={24} color="#1169C4" />
            <span className="">Avinto AS</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((navItem) => (
              <div key={navItem.label}>
                <Link
                  href={`${navItem.href}?userId=${userId}`}  // Append userId here
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted/80 
                    ${
                      isActive(navItem.href) || isParentActive(navItem)
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  onClick={(e) => {
                    if (navItem.subItems) {
                      e.preventDefault();
                      toggleExpand(navItem.label);
                    }
                  }}
                >
                  {navItem.icon}
                  {navItem.label}
                  {navItem.subItems &&
                    (expandedItem === navItem.label ? (
                      <ChevronDown className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    ))}
                </Link>
                {navItem.subItems && expandedItem === navItem.label && (
                  <div className="ml-6 mt-2">
                    {navItem.subItems.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={`${subItem.href}?userId=${userId}`}  // Append userId here
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted/80 
                          ${
                            isActive(subItem.href)
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                      >
                        {subItem.icon}
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
