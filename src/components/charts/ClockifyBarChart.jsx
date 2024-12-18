import React from 'react'
import { Bar, BarChart, XAxis, YAxis, Cell, CartesianGrid } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { formatDuration } from '@/lib/utils';

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
        const data = payload[0].payload;
        const { name, value: durationInSeconds, color } = data;
    
        return (
            <div className= "flex items-center min-w-[8rem] gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
            
                <div
                    className=
                    "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg] h-2.5 w-2.5"
                        style={{
                            "--color-bg": color,
                            "--color-border": color,
                            }}
                            />
            <p>{name}:</p>
            <p className="">{`${formatDuration(durationInSeconds)}`}</p>
            </div>
        );
        }
    
        return null;
    };

function ClockifyBarChart({chartConfig,chartData}) {
    const total = chartData.reduce((acc, data) => {
        return acc + data.value;  // Accumulate the durations
    }, 0);

   const maxTextLength=25;
        const chartDataWithPercentage = chartData.map(entry => ({
        ...entry,
          percentage: (entry.value / total) * 100, 
          remaining: 100 - (entry.value / total) * 100 ,
        // combinedLabel: `${entry.name}    \u00A0\u00A0\u00A0\u00A0 ${formatDuration(entry.value)}`
        combinedLabel: `${entry.name?.length>maxTextLength?entry.name.substring(0, maxTextLength):entry.name}    \u00A0\u00A0\u00A0\u00A0 ${formatDuration(entry.value)}`
        }));
    
  return (
    <ChartContainer config={chartConfig} className="pt-3">
  <BarChart
    layout="vertical"
    width={400}
    // height={350}
    data={chartDataWithPercentage}
    margin={{ top: 10, right: 50, bottom: 0, left: 70}}
    className=""
    accessibilityLayer 
  >
     <CartesianGrid vertical={false} />
    <XAxis type="number" domain={[0, 100]} hide />
    
    <YAxis
      dataKey="combinedLabel"
      type="category"
      tickLine={false}
      axisLine={false}
      className="font-medium text-xs"
      width={300}
    />

    {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
    <ChartTooltip
            cursor={false}
            content={<CustomTooltip/>}
          />
    
    <Bar 
      dataKey="percentage" 
      stackId="a" 
      radius={[5, 0, 0, 5]}
      label={({  y, value ,height}) => (
        <text
          x={960}  // Position the label outside the bar to the right
          y={y + height / 2}  // Center the label vertically along the bar
          fontSize={12}
          // fill="#FFFFFF"
          className=" fill-secondary-foreground"
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
  )
}

export default ClockifyBarChart
