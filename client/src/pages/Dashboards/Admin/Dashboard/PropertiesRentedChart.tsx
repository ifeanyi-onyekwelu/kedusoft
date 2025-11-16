// PropertiesRentedChart.tsx
import React from "react";
import {
    ComposedChart,
    Area,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { month: "Jan", value: 3000 },
    { month: "Feb", value: 3200 },
    { month: "Mar", value: 2800 },
    { month: "Apr", value: 3400 },
    { month: "May", value: 7000 },
    { month: "Jun", value: 4000 },
    { month: "Jul", value: 4500 },
    { month: "Aug", value: 10000 },
    { month: "Sep", value: 5000 },
    { month: "Oct", value: 4500 },
    { month: "Nov", value: 5400 },
    { month: "Dec", value: 5600 },
];

const PropertiesRentedChart: React.FC = () => {
    return (
        <div className="py-2">
            <ResponsiveContainer width="100%" height={250}>
                <ComposedChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                    <XAxis dataKey="month" tick={{ fill: "#8884d8" }} />
                    <YAxis />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="teal"
                        fill="rgba(0, 128, 128, 0.2)"
                    />
                    <Line type="monotone" dataKey="value" stroke="teal" strokeWidth={2} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PropertiesRentedChart;
