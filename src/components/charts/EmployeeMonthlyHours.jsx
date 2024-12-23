"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const rawData = payload[0]?.payload.raw; // Access raw data from payload
    return (
      <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-1.5 py-0.5 text-xs shadow-xl">
        <p style={{ fontWeight: "bold", marginBottom: "5px" }}>{label}</p>
        {payload.map((entry, index) => {
          const rawValue = rawData[entry.name] || 0; // Get raw value for the key
          const percentageValue = entry.value; // Percentage value from processed data
          return (
            <div key={`item-${index}`} className="flex items-center gap-1">
              <div
                className="shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg] h-2.5 w-2.5"
                style={{
                  "--color-bg": entry.fill,
                  "--color-border": entry.fill,
                }}
              />
              <span style={{ flexGrow: 1 }}>{entry.name}</span>
              <span>{rawValue.toFixed(2)} hrs</span> {/* Raw value */}
              <span>({percentageValue.toFixed(2)}%)</span> {/* Percentage */}
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};


function calculateRemainingHours(item, maxHours = 7) {
  const totalCompleted = Object.keys(item)
    .filter((key) => key !== "name")
    .reduce((sum, key) => sum + item[key], 0);
  return maxHours - totalCompleted;
}


// function convertHoursToPercentage(data = [], maxHours = 7) {
//   if (!Array.isArray(data)) {
//     return []; // Return an empty array if data is not an array
//   }
//   return data.map((item) => {
//     const convertedItem = { ...item };
//     Object.keys(item).forEach((key) => {
//       if (key !== "name") {
//         convertedItem[key] = (item[key] / maxHours) * 100; // Convert to percentage
//       }
//     });
//     return convertedItem;
//   });
// }
function convertHoursToPercentage(data = []) {
  if (!Array.isArray(data)) {
    return []; // Return an empty array if data is not an array
  }

  return data.map((item) => {
    const totalHours = Object.keys(item)
      .filter((key) => key !== "name")
      .reduce((sum, key) => sum + item[key], 0);

    const convertedItem = { ...item, raw: { ...item } }; // Add raw data for tooltip access

    Object.keys(item).forEach((key) => {
      if (key !== "name") {
        convertedItem[key] = (item[key] / totalHours) * 100;
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
        <ChartTooltip content={<CustomTooltip/>} />
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
