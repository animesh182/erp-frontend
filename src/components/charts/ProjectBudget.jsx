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

// Function to calculate the total expense percentage for each project
function calculateExpensePercentage(data) {
  return data.map((item) => {
    const totalExpenses = Object.values(item.expenses).reduce(
      (sum, expense) => sum + expense,
      0
    );
    const expensePercentage = (
      (totalExpenses / item.totalIncome) *
      100
    ).toFixed(1);
    const profitPercentage = 100 - expensePercentage;
    return { ...item, totalExpenses, expensePercentage, profitPercentage }; // Add expensePercentage to the item
  });
}
function parseToolTipLabel(value) {
  if (value === "direct") {
    return "Direct Cost";
  } else if (value === "fixed") {
    return "Fixed Cost";
  } else if (value === "npa") {
    return "NPA";
  }
}

function RenderLegend() {
  return (
    <div className="flex justify-center">
      <div className="flex items-center text-[#2563EB] mr-4 font-semibold">
        Dynamic Revenue (Recurring)
      </div>
      <div className="flex items-center font-semibold">Fixed Costs</div>
    </div>
  );
}

const colorArray = [
  "#4A90E2", // Blue
  "#E47CF5", // Purple
  "#F5A623", // Orange
  "#50C878", // Emerald green
  "#FF6347", // Tomato red
  "#FFD700", // Gold
  "#9370DB", // Medium purple
  "#FFFF00", // Yellow
];

function generateChartConfig(rawData) {
  const chartConfig = {};
  let colorIndex = 0;

  rawData.forEach((project) => {
    const projectName = project.project?.trim().toLowerCase(); 
   
    chartConfig[projectName] = {
      color: colorArray[colorIndex % colorArray.length],
      label: project.project, 
    };

    colorIndex++;
  });
  return chartConfig;
}


export default function ProjectBudgetChart({ rawData }) {


  const chartConfig = generateChartConfig(rawData);
  const updatedChartData = calculateExpensePercentage(rawData);
  const recurringProjects = updatedChartData
    .filter((data) => data.isRecurring)
    .map((filterData) => filterData.project);
  const { theme } = useTheme();

  function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
      const {
        project,
        totalIncome,
        expenses,
        totalExpenses,
        expensePercentage,
      } = payload[0].payload;
      return (
        <div className={`p-2 bg-primary-foreground rounded-md shadow-lg`}>
          <p className="font-semibold">{`${project}`}</p>
          <p className="">{`Total Income: ${formatAmountDecimalToNOK(
            totalIncome
          )} kr`}</p>
          <p className="">{`Total Expenses: ${formatAmountDecimalToNOK(
            totalExpenses
          )} kr (${expensePercentage}%)`}</p>
          <p className="mt-2 font-semibold">Breakdown of Expenses:</p>
          {Object.entries(expenses).map(([key, value]) => (
            <p key={key} className="expense-item">{`${parseToolTipLabel(
              key
            )}: ${formatAmountDecimalToNOK(value)} kr`}</p>
          ))}
        </div>
      );
    }

    return null;
  }



  return (
    <ResponsiveContainer height="100%">
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={updatedChartData} // Use the updated data
          layout="vertical"
          className="w-full"
        >
          <XAxis
            type="number"
            dataKey="expensePercentage" // Display expense percentage on the XAxis
            ticks={[0, 20, 40, 60, 80, 100]} // Custom ticks
            orientation="top"
            tickLine={false}
          />
          <YAxis
            dataKey="project"
            type="category"
            tick={({ x, y, payload }) => {
              const label = payload.value;
              const lines =
                label.length > 15
                  ? [label.slice(0, 15), label.slice(15)]
                  : [label];

              return (
                <text
                  x={x}
                  y={y - (lines.length - 1) * 5} // Adjust y position for multiple lines
                  stroke={recurringProjects.includes(label) ? "#2563EB" : ""} // Blue if recurring, black otherwise
                  strokeWidth={0.4}
                  fontSize={12}
                  fontWeight={500}
                  textAnchor="end"
                >
                  {lines.map((line, index) => (
                    <tspan x={x} dy={index === 0 ? 0 : 15} key={index}>
                      {line}
                    </tspan>
                  ))}
                </text>
              );
            }}
            tickLine={false}
            axisLine={false}
            width={100} // Increase width for long labels if needed
          />

          <ChartTooltip cursor={false} content={<CustomTooltip />} />
          <Legend
            content={RenderLegend}
            verticalAlign="bottom"
            align="center"
            layout="horizontal"
          />

          {/* Main bar */}
          <Bar dataKey="expensePercentage" stackId="a">
            {updatedChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`} // Provide a unique key
                fill={chartConfig[entry.project.trim().toLowerCase()]?.color || "#CCCCCC"}
              />
            ))}
            <LabelList
              dataKey="expensePercentage"
              position="insideRight"
              style={{ fill: "black", fontWeight: 500 }} // Set the label color to black
            />
          </Bar>
          <Bar
            dataKey={() => 100} // Full width bar for background
            stackId="a"
            radius={[0, 5, 5, 0]}
          >
            {updatedChartData.map((entry, index) => (
              <Cell
                key={`bg-cell-${index}`} // Provide a unique key for the background cells
                // fill={chartConfig[entry.project].color}
                fill={chartConfig[entry.project.trim().toLowerCase()]?.color || "#CCCCCC"}
                opacity={0.3}
              />
            ))}
            <LabelList
              dataKey="profitPercentage"
              position="center"
              style={{ fill: "black", fontWeight: 600 }} // Set the label color to black
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
