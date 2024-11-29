

"use client";

import React, { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatDuration } from "@/lib/utils";

// Chart configuration
const chartConfig = {
  width: 400,
  height: 50,
  layout: "vertical",
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  barSize: 40,
  className: "w-full",
  style: {
    // Ensure smooth animations
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale"
  }
};

const CustomTooltip = ({ payload, label }) => {
  if (!payload || payload.length === 0) return null;
  const totalDuration = payload.reduce((total, entry) => total + entry.value, 0);

  return (

    <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      {payload.map((entry, index) => {
        const { name, value, fill } = entry;
        const formattedDuration = formatDuration(value);
        const percentage = ((value / totalDuration) * 100).toFixed(2);
      
        return (
            <div
                    key={index}  className= "flex w-full flex-wrap items-center gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground text-xs" >
                    <div
                          className=
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg] h-2.5 w-2.5"
                          
                          style={{
                            "--color-bg": fill,
                            "--color-border": fill,
                          }}
                        />
              <p className="">{name}</p>
            <p className="text-muted-foreground">
              {formattedDuration} ({percentage}%)
            </p>
          </div>
        );
      })}
    
    </div>
  );
};



const ClockifyBarChart = ({ userName, selected }) => {
  const chartInfo = useMemo(() => {
    if (!Array.isArray(selected)) {
      return null;
    }
    
    const selectedUser = selected.find(user => user.userName === userName);
    
    if (!selectedUser) {
      return null;
    }

    const chartData = [{
      userName: selectedUser.userName,
      ...selectedUser.projects.reduce((acc, project) => {
        acc[project.projectName] = project.duration;
        return acc;
      }, {})
    }];

    const totalDuration = selectedUser.projects.reduce(
      (total, project) => total + project.duration,
      0
    );

    return {
      chartData,
      totalDuration,
      projects: selectedUser.projects
    };
  }, [selected, userName]);

  if (!chartInfo) {
    return (
      <div className="flex justify-between">
        <p className="text-muted-foreground">00:00:00</p>
        <p className="text-muted-foreground">No data for {userName}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-7">
      <div className="text-muted-foreground min-w-24">
        {formatDuration(chartInfo.totalDuration)}
      </div>
      <ChartContainer className="h-14 w-full" config={chartConfig}>
        <BarChart 
          data={chartInfo.chartData} 
          layout="vertical"
          accessibilityLayer
          // className="w-full"
        >
          <CartesianGrid vertical={false} />
          <XAxis 
            type="number" 
            hide 
            domain={[0, 'dataMax']}
          />
          <YAxis 
            type="category" 
            dataKey="duration" 
            hide 
          />
            <ChartTooltip content={<CustomTooltip/>}
            wrapperStyle={{ zIndex: 50 }}/>

          {chartInfo.projects.map((project) => (
            <Bar
              key={project.projectName}
              dataKey={project.projectName}
              stackId="a"
              fill={project.projectColor}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
};

ClockifyBarChart.displayName = 'ClockifyBarChart';

const MemoizedClockifyBarChart = React.memo(ClockifyBarChart);
MemoizedClockifyBarChart.displayName = 'MemoizedClockifyBarChart';

export default MemoizedClockifyBarChart;