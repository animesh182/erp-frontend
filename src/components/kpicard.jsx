import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAmountToNOK } from "@/lib/utils";
export default function KpiCard({
  title,
  value,
  change,
  period,
  icon,
  isMoney = true,
  isTrend = true,
  iconSize = "w-4 h-4", // Default size for icons
}) {
  return (
    <Card x-chunk="dashboard-01-chunk-0" className="w-full hover:bg-muted">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className={`text-muted-foreground ${iconSize}`}>
          {icon && React.cloneElement(icon, { className: iconSize })}
        </span>
        {/* Add text-sm or other Tailwind size classes here */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isMoney ? `${formatAmountToNOK(value)}` : value}
        </div>
        <p className="text-xs text-muted-foreground">
          {isTrend ? `${change}% from last ${period}` : period}
        </p>
      </CardContent>
    </Card>
  );
}
