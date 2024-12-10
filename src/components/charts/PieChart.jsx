"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell, Legend } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  Changeride: {
    label: "Change Ride",
    color: "hsl(var(--chart-3))",
  },
  AvintoTest: {
    label: "Avinto Test",
    color: "hsl(var(--chart-1))",
  },
  JamboTravelHouse: {
    label: "Jambo Travel House",
    color: "hsl(var(--chart-2))",
  },
};

function DoughnutChart({ chartData }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-start pb-0">
        <CardTitle>Projects Chart</CardTitle>
        <CardDescription className="text-xs">
          This chart shows the projects assigned to you.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={140}
              labelLine={true}
              // label={renderCustomizedLabel}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {/* <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              payload={chartData.map((item) => ({
                id: item.name,
                type: "circle",
                value: `${item.name}`,
                color: item.color,
              }))}
            /> */}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default DoughnutChart;
