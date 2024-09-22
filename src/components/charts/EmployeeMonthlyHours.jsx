"use client";

import React from "react";
import {
  Bar,
  BarChart,
  YAxis,
  XAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { UserCircleIcon } from "lucide-react";

function convertHoursToPercentage(data, maxHours = 8) {
  return data.map((item) => {
    const convertedItem = { ...item };
    Object.keys(item).forEach((key) => {
      if (key !== "name") {
        convertedItem[key] = (item[key] / maxHours) * 100;
      }
    });
    return convertedItem;
  });
}
const chartConfig = {
  "Avinto ERP": {
    color: "#4A90E2",
    label: "Avinto ERP",
  },
  "Jambo Booking House": {
    color: "#E47CF5",
    label: "Jambo Booking House",
  },
  "Basic Booking App": {
    color: "#F5A623",
    label: "Basic Booking App",
  },
  Ebibaaha: {
    color: "#50E3C2",
    label: "Ebibaaha",
  },
};
function calculateRemainingHours(item, maxHours = 8) {
  const totalCompleted = Object.keys(item)
    .filter((key) => key !== "name")
    .reduce((sum, key) => sum + item[key], 0);
  return maxHours - totalCompleted;
}

// Custom YAxis tick to display both name and remaining hours

export default function EmployeeMonthlyHours({ rawData }) {
  const data = convertHoursToPercentage(rawData);
  const CustomYAxisTick = ({ x, y, payload }) => {
    const remainingHours = calculateRemainingHours(rawData[payload.index]);

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-150} y={-10} width="150" height="40">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            // style={{ display: "flex", alignItems: "center" }}
            className="flex w-full items-center justify-between gap-x-3"
          >
            <UserCircleIcon className="h-8 w-8 pb-1.5" />
            <div className="flex flex-col w-full">
              <div className="font-semibold">{payload.value}</div>
              <div className="text-[10px]">
                {remainingHours} {""}
                {remainingHours === 1 ? "hour available" : "hours available"}
              </div>
            </div>
          </div>
        </foreignObject>
      </g>
    );
  };
  return (
    <ChartContainer className="h-[400px] w-full" config={chartConfig}>
      {/* <ResponsiveContainer width="100%" height="100%"> */}
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        barCategoryGap="20%"
      >
        <CartesianGrid
          stroke="#ccc"
          strokeWidth={2}
          strokeDasharray="3 3"
          horizontal={true}
          vertical={true}
        />
        <XAxis
          type="number"
          tick={{ fontSize: 12 }}
          ticks={[0, 20, 40, 60, 80, 100]} // Custom ticks
          domain={[0, 100]} // Set domain from 0 to 8 hours
          orientation="top"
          axisLine={{
            stroke: "#ccc",
            strokeDasharray: "3 3",
          }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={<CustomYAxisTick />} // Use custom tick component
          axisLine={{ stroke: "#ccc" }}
          tickLine={true}
          // width={20}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.keys(chartConfig).map((key, index, array) => {
          return (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={chartConfig[key].color}
            />
          );
        })}
      </BarChart>
      {/* </ResponsiveContainer> */}
    </ChartContainer>
  );
}
