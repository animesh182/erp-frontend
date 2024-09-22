import React from "react";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import KpiCard from "@/components/kpicard";

export default function Finances() {
  const kpivalues = [
    {
      title: "Total Revenue",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      value: "$45,969.69",
      change: "+20.1%",
      period: "month",
    },
    {
      title: "Subscriptions",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      value: "+2350",
      change: "+180.1%",
      period: "month",
    },
    {
      title: "Sales",
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
      value: "+12,234",
      change: "+19%",
      period: "month",
    },
    {
      title: "Active Now",
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      value: "+573",
      change: "+201",
      period: "hour",
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpivalues.map((kpi) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            icon={kpi.icon}
            value={kpi.value}
            change={kpi.change}
            period={kpi.period}
          />
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="md:col-span-3 p-4" x-chunk="dashboard-01-chunk-4">
          xdd
        </Card>
      </div>
    </main>
  );
}
