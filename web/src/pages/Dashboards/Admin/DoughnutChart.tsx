import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary components from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  colors: string[];
  width?: string;
  height?: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  labels,
  data,
  colors,
  width = "100px",
  height = "100px",
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: { enabled: true },
      legend: { display: false },
    },
  };

  return (
    <div className="flex items-center p-1 w-1/2">
      <Doughnut data={chartData} options={options} style={{ width, height }} />
    </div>
  );
};

export default DoughnutChart;
