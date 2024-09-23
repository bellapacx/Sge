import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Filler,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Register necessary components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Filler,
  Tooltip,
  Legend,
  Title
);

interface SalesData {
  date: string;
  total: number;
}

interface ChartProps {
  salesData: SalesData[];
}

const Chart: React.FC<ChartProps> = ({ salesData }) => {
  const data = {
    labels: salesData.map((item) => item.date),
    datasets: [
      {
        label: 'Sales',
        data: salesData.map((item) => item.total),
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return <Line data={data} />;
};

export default Chart;
