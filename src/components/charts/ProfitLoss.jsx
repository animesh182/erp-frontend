import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { formatAmountDecimalToNOK } from "@/lib/utils";

export default function ProfitLossChart({ data }) {
  function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
      const { totalIncome, expenses, netIncome } = payload[0].payload;
      return (
        <div className={`p-2 text-xs bg-primary-foreground rounded shadow-lg `}>
          <p className="font-semibold">{`Revenue: ${formatAmountDecimalToNOK(
            totalIncome
          )} kr`}</p>
          <p className="">{`Cost: ${formatAmountDecimalToNOK(expenses)} kr`}</p>
          <p className="">{`Profit: ${formatAmountDecimalToNOK(
            netIncome
          )} kr`}</p>
        </div>
      );
    }

    return null;
  }
  return (
    <ResponsiveContainer height="100%">
      <ComposedChart
        width={600}
        height={200}
        data={data}
        margin={{
          top: 20,
          right: 40,
          bottom: 20,
          left: 20,
        }}
        barCategoryGap={10}
      >
        <CartesianGrid stroke="#f5f5f5" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickCount={6} />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickCount={6}
          tick={{ fontSize: 12 }}
          hide
        />

        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
          formatter={(value) => {
            if (value === "netIncome") return "Net Income";

            if (value === "expenses") return "Expenses";
            if (value === "profitPercentage") return "Profit Percentage";
            return value;
          }}
        />
        <Bar stackId="a" dataKey="expenses" fill="#F87171" yAxisId="left">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              opacity={entry.isProjected ? 0.5 : 1} // Adjust opacity based on isProjected
            />
          ))}
        </Bar>

        <Bar
          stackId="a"
          dataKey="netIncome"
          fill="#2563EB"
          yAxisId="left"
          radius={[5, 5, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              opacity={entry.isProjected ? 0.5 : 1} // Adjust opacity based on isProjected
            />
          ))}
        </Bar>
        <Line
          type="monotone"
          dataKey="profitPercentage"
          stroke="#68D391"
          yAxisId="right"
          dot={{ stroke: "#68D391", strokeWidth: 2 }}
        >
          <LabelList
            dataKey="profitPercentage"
            position="top"
            formatter={(value) => (value % 1 !== 0 ? value.toFixed(1) : value)}
            style={{ fontSize: "14px", fill: "#000" }}
          />
        </Line>
      </ComposedChart>
    </ResponsiveContainer>
  );
}
