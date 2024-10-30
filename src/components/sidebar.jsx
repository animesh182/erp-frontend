"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Home,
  LineChart,
  Package,
  ShoppingCart,
  Users,
  ChevronDown,
  ChevronRight,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { usePathname } from "next/navigation";
import { CompanyIcon } from "./companyicon";

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
    subItems: [
      {
        label: "General",
        href: "/dashboard/employees/general",
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        label: "Leave Request",
        href: "/dashboard/employees/leave-request",
        icon: <CreditCard className="h-4 w-4" />,
      },
    ],
  },
];


export default function Sidebar() {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleExpand = (label) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

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
    <aside className="hidden md:fixed md:top-0 md:left-0 md:h-full md:w-[220px] lg:w-[280px] md:border-r md:bg-muted/40 md:block md:overflow-y-auto">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <CompanyIcon size={24} color="#1169C4" />
            <span className="">Avinto AS</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((navItem) => (
              <div key={navItem.label}>
                <Link
                  href={navItem.href}
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
                        href={subItem.href}
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
        <div className="mt-auto p-4">
          {/* <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </aside>
  );
}
