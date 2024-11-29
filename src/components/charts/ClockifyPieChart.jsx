import React from 'react'
import { Pie, PieChart,Cell} from "recharts";


import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
function ClockifyPieChart({chartConfig,chartData}) {
    return (
    <ChartContainer
    config={chartConfig}
    className="w-full h-full flex justify-center items-center "  
    >
    {/* <div className="relative w-[500px] h-[500px] ml-10"> */}
    <PieChart width={500} height={500} className="w-full h-full"> 
        <ChartTooltip
        cursor={false}
        content={<ChartTooltipContent hideLabel />}
        />
        <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={65}
            outerRadius={190}
        >
        {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
        </Pie>
    </PieChart>
    {/* </div> */}
    </ChartContainer>
    )
}

export default ClockifyPieChart
