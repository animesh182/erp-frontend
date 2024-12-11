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
  isPercentage = false,
  iconSize = "w-4 h-4", // Default size for icons
  hasSubText = true,
  isSmall=false
}) {
  return (
    <Card x-chunk="dashboard-01-chunk-0" className="w-full hover:bg-muted">
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isSmall?"pb-0":"pb-2"}`}>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className={`text-muted-foreground ${iconSize}`}>
          {icon && React.isValidElement(icon)
            ? React.cloneElement(icon, { className: iconSize })
            : null}
        </span>
      </CardHeader>
      <CardContent >
        <div className="text-2xl font-bold">
          {isMoney ? `${formatAmountToNOK(value)}` : isPercentage? `${value}%` : value}
        </div>
        <p className="text-xs text-muted-foreground">
          {/* {hasSubText && isTrend ? `${change}% from last ${period}` : period} */}
          {period && (hasSubText && isTrend ? `${change}% from last ${period}` : period)}

        </p>
      </CardContent>
    </Card>
  );
}
