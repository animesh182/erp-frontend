"use client";

import React, { useMemo } from "react";
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
const colorPalette = [
  "#4A90E2",
  "#E47CF5",
  "#F5A623",
  "#50E3C2",
  "#FF7F50",
  "#B22222",
  "#DAA520",
  "#4682B4",
];

function calculateRemainingHours(item, maxHours = 8) {
  const totalCompleted = Object.keys(item)
    .filter((key) => key !== "name")
    .reduce((sum, key) => sum + item[key], 0);
  return maxHours - totalCompleted;
}

function convertHoursToPercentage(data = [], maxHours = 8) {
  if (!Array.isArray(data)) {
    return []; // Return an empty array if data is not an array
  }
  return data.map((item) => {
    const convertedItem = { ...item };
    Object.keys(item).forEach((key) => {
      if (key !== "name") {
        convertedItem[key] = (item[key] / maxHours) * 100; // Convert to percentage
      }
    });
    return convertedItem;
  });
}
function generateChartConfig(rawData) {
  const projectNames = new Set();
  rawData.forEach((user) => {
    Object.keys(user).forEach((key) => {
      if (key !== "name") {
        projectNames.add(key);
      }
    });
  });

  const chartConfig = {};
  [...projectNames].forEach((projectName, index) => {
    chartConfig[projectName] = {
      color: colorPalette[index % colorPalette.length],
      label: projectName,
    };
  });
  return chartConfig;
}

export default function EmployeeMonthlyHours({ rawData }) {
  const chartConfig = useMemo(() => generateChartConfig(rawData), [rawData]);
  const data = useMemo(() => convertHoursToPercentage(rawData), [rawData]);

  if (!rawData) return <>Loading...</>;
  const CustomYAxisTick = ({ x, y, payload }) => {
    // console.log(payload, "payload");
    const remainingHours = calculateRemainingHours(rawData[payload.index]).toFixed(2);
    const truncatedName = payload.value.split(" ").slice(0, 2).join(" ");
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
              <div className="font-semibold">{truncatedName}</div>
              <div className="text-[10px]">
                {remainingHours < 0
                  ? `${Math.abs(remainingHours)} hours Overtime`
                  : `${remainingHours} ${
                      remainingHours === 1
                        ? "hour available"
                        : "hours available"
                    }`}
              </div>
            </div>
          </div>
        </foreignObject>
      </g>
    );
  };


  return (
    <ChartContainer className="h-[800px] w-full" config={chartConfig}>
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
