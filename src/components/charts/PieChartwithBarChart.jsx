"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Bar, BarChart, XAxis, YAxis, Cell, Tooltip, LabelList } from "recharts";

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
import { formatDuration } from "@/lib/utils";

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
  value: {
    label: "Value",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const { name, value: durationInSeconds, color } = data;

    return (
      <div 
        className="custom-tooltip flex gap-4" 
        style={{
          backgroundColor: '#fff', 
          padding: '5px', 
          border: `1px solid ${color}`, 
          borderRadius: '4px'
        }}
      >
        <p style={{ color }}>{name}</p>
        <p className="text-black">{`${formatDuration(durationInSeconds)}`}</p>
      </div>
    );
  }

  return null;
};
// export const formatDuration = (totalSeconds) => {
//   const hours = Math.floor(totalSeconds / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
// };
function PieChartwithBarChart({chartData}) {

  const formattedChartData = chartData.map((entry) => ({
    ...entry,
    value: formatDuration(entry.value), // Apply formatDuration here
  }));


const total = chartData.reduce((acc, data) => {
  return acc + data.value;  // Accumulate the durations
}, 0);
  const chartDataWithPercentage = chartData.map(entry => ({
    ...entry,
    percentage: (entry.value / total) * 100, // Calculate percentage
    remaining: 100 - (entry.value / total) * 100 ,// Remaining percentage for black color
  combinedLabel: `${entry.name}    \u00A0\u00A0\u00A0\u00A0 ${formatDuration(entry.value)}`
  }));

  
  return (
    // <Card className="flex justify-between items-center gap-6 pr-6 w-full h-full">
    <Card className="grid grid-cols-8 justify-between items-center gap-6 pr-6 w-fit h-fit">

<div className="col-span-3 flex justify-center items-center h-[400px]"> 
  <CardContent className="p-0 w-full h-full"> 
    <ChartContainer
      config={chartConfig}
      className="w-full h-full flex justify-center items-center"  
    >
      <div className="relative w-[400px] h-[400px] ml-10">
        <PieChart width={400} height={400} className="w-full h-full"> 
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={65}
            outerRadius={170}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </ChartContainer>
  </CardContent>
</div>


      {/* Bar Chart Section */}
      {/* <div className="flex-1 "> */}
      <div className="col-span-5   ">
     
        <CardContent className="">
        <ChartContainer config={chartConfig} className="pt-3">
  <BarChart
    layout="vertical"
    width={400}
    // height={350}
    data={chartDataWithPercentage}
    margin={{ top: 10, right: 50, bottom: 0, left: 70}}
    className=""
  >
    <XAxis type="number" domain={[0, 100]} hide />
    
    <YAxis
      dataKey="combinedLabel"
      type="category"
      tickLine={false}
      axisLine={false}
      className="font-medium text-xs"
      width={300}
    />

    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
    
    <Bar 
      dataKey="percentage" 
      stackId="a" 
      radius={[5, 0, 0, 5]}
      label={({  y, value ,height}) => (
        <text
          x={950}  // Position the label outside the bar to the right
          y={y + height / 2}  // Center the label vertically along the bar
          fontSize={12}
          fill="#333"
          textAnchor="start"
          alignmentBaseline="middle"

        >
          {`${value.toFixed(1)}%`}
        </text>
      )}
    >
      {chartDataWithPercentage.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} />
      ))}
    </Bar>

    {/* Remaining Percentage Bar with lower opacity */}
    <Bar dataKey="remaining" stackId="a" radius={[0, 5, 5, 0]}>
      {chartDataWithPercentage.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} opacity={0.25} />
      ))}
    </Bar>
  </BarChart>
</ChartContainer>

        </CardContent>
      </div>
    </Card>
  );
}

export default PieChartwithBarChart;
