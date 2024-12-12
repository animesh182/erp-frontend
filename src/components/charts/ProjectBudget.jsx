"use client";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Cell,
  LabelList,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import { formatAmountDecimalToNOK } from "@/lib/utils";
import { useTheme } from "next-themes";

// Function to calculate the cost exhausted percentage for each project
function calculateCostExhaustedPercentage(data) {
  return data?.map((item) => {
    const costExhaustedPercentage =
      item.total_income > 0
        ? ((item.total_cost / item.total_income) * 100).toFixed(1)
        : "0.0";
    const profitPercentage = 100 - parseFloat(costExhaustedPercentage);
    return {
      ...item,
      costExhaustedPercentage,
      profitPercentage: profitPercentage.toFixed(1),
    };
  });
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const { project_name, total_income, total_cost, costExhaustedPercentage } =
      payload[0].payload;
    return (
      <div className={`p-2 bg-primary-foreground rounded-md shadow-lg`}>
        <p className="font-semibold">{`${project_name}`}</p>
        <p className="">{`Total Income: ${formatAmountDecimalToNOK(
          total_income
        )} kr`}</p>
        <p className="">{`Total Cost: ${formatAmountDecimalToNOK(
          total_cost
        )} kr (${costExhaustedPercentage}%)`}</p>
      </div>
    );
  }
  return null;
}

function RenderLegend() {
  return (
    <div className="flex justify-center">
      <div className="flex items-center text-[#2563EB] mr-4 font-semibold">
        Ongoing Projects
      </div>
      <div className="flex items-center font-semibold">Completed Projects</div>
    </div>
  );
}

export default function ProjectBudgetChart({ rawData }) {
  const updatedChartData = calculateCostExhaustedPercentage(rawData);

  // Dynamically generate chart config
  const chartConfig = updatedChartData.reduce((config, item, index) => {
    const colors = [
      "#4A90E2",
      "#E47CF5",
      "#F5A623",
      "#50C878",
      "#FF6347",
      "#FFD700",
      "#9370DB",
    ];
    config[item.project_name] = {
      color: colors[index % colors.length],
      label: item.project_name,
    };
    return config;
  }, {});

  return (
    <ChartContainer className="min-h-[600px] w-full" config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={updatedChartData}
        layout="vertical"
        className="w-full"
      >
        <XAxis
          type="number"
          dataKey="costExhaustedPercentage"
          ticks={[0, 20, 40, 60, 80, 100]}
          orientation="top"
          tickLine={false}
        />
        <YAxis
          dataKey="project_name"
          type="category"
          tick={({ x, y, payload }) => {
            const label = payload.value;
            let truncatedLabel = label.split(" ")[0];
            if (truncatedLabel.length > 10) {
              truncatedLabel = truncatedLabel.substring(0, 10) + "-";
            }
            return (
              <text
                x={x}
                y={y}
                stroke={chartConfig[label].color}
                strokeWidth={0.6}
                fontSize={12}
                fontWeight={500}
                textAnchor="end"
              >
                <tspan x={x} dy={0}>
                  {truncatedLabel}
                </tspan>
              </text>
            );
          }}
          tickLine={false}
          axisLine={false}
          width={100}
        />

        <ChartTooltip cursor={false} content={<CustomTooltip />} />
        <Legend
          content={RenderLegend}
          verticalAlign="bottom"
          align="center"
          layout="horizontal"
        />

        {/* Main bar */}
        <Bar dataKey="costExhaustedPercentage" stackId="a">
          {updatedChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartConfig[entry.project_name].color}
            />
          ))}
          {/* <LabelList
            dataKey="costExhaustedPercentage"
            position="insideRight"
            style={{ fill: "black", fontWeight: 500 }}
          /> */}
        </Bar>
        <Bar dataKey={() => 100} stackId="a" radius={[0, 5, 5, 0]}>
          {updatedChartData.map((entry, index) => (
            <Cell
              key={`bg-cell-${index}`}
              fill={chartConfig[entry.project_name].color}
              opacity={0.3}
            />
          ))}
          <LabelList
            dataKey="profitPercentage"
            position="center"
            style={{ fill: "#000000", fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
