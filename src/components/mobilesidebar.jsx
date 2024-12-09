"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import Link from "next/link";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { navItems } from "./sidebar";
import { usePathname } from "next/navigation";
import { CompanyIcon } from "./companyicon";

export default function MobileSidebar() {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <CompanyIcon size={36} color="#1169C4" />
            <span className="sr-only">Avinto AS</span>
          </Link>
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
      </SheetContent>
    </Sheet>
  );
}
