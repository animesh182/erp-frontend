"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Bar, BarChart, XAxis, YAxis, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const pieChartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const barChartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

function PieChartwithBarChart({chartData}) {

  return (
    <Card className="flex justify-between items-center gap-6 px-6">
      {/* Pie Chart Section */}
      <div className="flex-1 ">
        {/* <CardHeader className=" pb-0" /> */}
        <CardContent className=" pb-0">
          <ChartContainer
            config={chartConfig}
            // className="mx-auto" // Remove height restrictions
          >
            <PieChart width={400} height={400}> {/* Adjust width and height */}
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={80} // Increase innerRadius
                outerRadius={200} // Increase outerRadius
                // fill="color"
              >
                 {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              </Pie>
                {/* <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              // cx="50%"
              // cy="50%"
              innerRadius={40}
              outerRadius={80}
              // labelLine={true}
              // // label={renderCustomizedLabel}
            /> */}
            </PieChart>
          </ChartContainer>
        </CardContent>
        {/* <CardFooter className="flex-col gap-2 text-sm" /> */}
      </div>

      {/* Bar Chart Section */}
      <div className="flex-1">
        {/* <CardHeader /> */}
        <CardContent className="p-2">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={barChartData}
              layout="vertical"
              margin={{
                left: -20,
              }}
            >
              <XAxis type="number" dataKey="desktop" hide />
              <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={5} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </div>
    </Card>
  );
}

export default PieChartwithBarChart;
