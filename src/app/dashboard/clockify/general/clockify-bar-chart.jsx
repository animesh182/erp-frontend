

"use client";

import { formatDuration } from "@/lib/utils";
import React, { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";

const CustomTooltip = ({ payload, label }) => {
  if (!payload || payload.length === 0) return null;
  const { payload: userData } = payload[0];
  const totalDuration = payload.reduce((total, entry) => total + entry.value, 0);

  return (
    <div className="custom-tooltip gap-4 w-80 bg-background p-2 rounded-2 shadow-2xl absolute left-10 top-7">
      <div className="total-duration flex justify-between mb-5">
        <p>{userData.userName}</p>
        <p>{formatDuration(totalDuration)}</p>
      </div>
      {payload.map((entry, index) => {
        const { name, value, fill } = entry;
        const formattedDuration = formatDuration(value);
        const percentage = ((value / totalDuration) * 100).toFixed(2);
      
        return (
          <div 
            key={index} 
            className="project-info flex justify-between"
            style={{ color: fill || '#000' }}
          >
            <span style={{ backgroundColor: fill }} className="color-box"></span>
            <p className="text-left flex-1">{name}</p>
            <p className="flex-2">{formattedDuration} ({percentage}%)</p>
          </div>
        );
      })}
    </div>
  );
};

// Base component
const ClockifyBarChart = ({ userName, selected }) => {
  // Move all calculations into a single useMemo before any conditionals
  const chartInfo = useMemo(() => {
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
        <p className="">00:00:00</p>
        <p className="">No data for {userName}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-7">
      <div className="">{formatDuration(chartInfo.totalDuration)}</div>
      <BarChart width={400} height={50} data={chartInfo.chartData} layout="vertical">
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="duration" hide />
        <Tooltip 
          content={CustomTooltip}
          wrapperStyle={{ zIndex: 1000 }}
        />
        {chartInfo.projects.map((project) => (
          <Bar
            key={project.projectName}
            dataKey={project.projectName}
            stackId="a"
            fill={project.projectColor}
            className=""
          />
        ))}
      </BarChart>
    </div>
  );
};

ClockifyBarChart.displayName = 'ClockifyBarChart';

const MemoizedClockifyBarChart = React.memo(ClockifyBarChart);
MemoizedClockifyBarChart.displayName = 'MemoizedClockifyBarChart';

export default MemoizedClockifyBarChart;