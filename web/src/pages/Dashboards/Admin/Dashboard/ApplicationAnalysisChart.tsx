// AreaChartComponent.tsx
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", value: 5 },
  { month: "Feb", value: 10 },
  { month: "Mar", value: 15 },
  { month: "Apr", value: 20 },
  { month: "May", value: 25 },
  { month: "Jun", value: 30 },
  { month: "Jul", value: 28 },
  { month: "Aug", value: 32 },
  { month: "Sep", value: 35 },
  { month: "Oct", value: 37 },
  { month: "Nov", value: 90 },
  { month: "Dec", value: 40 },
];

const ApplicationsAnalysisChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={150} className="text-xs">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="month" tick={{ fill: "#8884d8" }} />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#c0392b"
          fill="rgba(192, 57, 43, 0.2)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ApplicationsAnalysisChart;
