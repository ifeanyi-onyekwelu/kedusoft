import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Button } from "@mantine/core";

// Register Chart.js modules
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Define the props interface
interface LineChartProps {
    statistics: { title: string; value: number }[];
}

const LineChart: React.FC<LineChartProps> = ({ statistics }) => {
    // Extract the required statistics
    const totalBalance = statistics.find(stat => stat.title === "Total Balance")?.value || 0;
    const maintenanceCost = statistics.find(stat => stat.title === "Maintenance Cost")?.value || 0;

    // Generate dynamic data based on statistics
    const data = {
        labels: [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ],
        datasets: [
            {
                label: "Total Balance",
                data: Array(12).fill(totalBalance), // Fill all months with total balance
                borderColor: "teal",
                backgroundColor: "rgba(0, 128, 128, 0.2)",
                tension: 0.4,
            },
            {
                label: "Maintenance Cost",
                data: Array(12).fill(maintenanceCost), // Fill all months with maintenance cost
                borderColor: "pink",
                backgroundColor: "rgba(255, 182, 193, 0.2)",
                tension: 0.4,
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
        },
    };

    // Function to export chart data to CSV
    const exportToCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";

        // Add headers
        csvContent += "Month," + data.datasets.map((d) => d.label).join(",") + "\n";

        // Add data rows
        data.labels.forEach((label, index) => {
            const row = label + "," + data.datasets.map((d) => d.data[index]).join(",");
            csvContent += row + "\n";
        });

        // Create a link element to download the CSV file
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "chart_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="chart-container bg-white p-3 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Earnings</h2>
                <Button variant="outline" size="xs" onClick={exportToCSV}>
                    Export
                </Button>
            </div>
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;
