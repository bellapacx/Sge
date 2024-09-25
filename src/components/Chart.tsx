import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register the required Chart.js components
Chart.register(...registerables);

interface SalesData {
  date: string;
  total: number;
}

interface ChartProps {
  salesData: SalesData[];
}

const CustomChart: React.FC<ChartProps> = ({ salesData }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Sort salesData by date
        const sortedSalesData = [...salesData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(74, 144, 226, 0.5)'); // Adjusted gradient color
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: sortedSalesData.map((data) => data.date),
            datasets: [
              {
                label: 'Total Sales',
                data: sortedSalesData.map((data) => data.total),
                borderColor: '#4a90e2', // Adjusted border color for visibility
                borderWidth: 2,
                fill: true,
                backgroundColor: gradient,
                pointBackgroundColor: '#4a90e2',
                pointBorderColor: '#fff',
                pointRadius: 6,
                pointHoverRadius: 8,
                hoverBackgroundColor: '#4a90e2',
                hoverBorderColor: '#fff',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: '#4a90e2', // Adjusted legend label color for better visibility
                  font: {
                    size: 14,
                    family: 'Arial, sans-serif',
                  },
                },
              },
              tooltip: {
                backgroundColor: '#000000',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#4a90e2',
                borderWidth: 1,
                displayColors: false,
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                  label: (context) => {
                    const value = context.raw as number; // Ensure it's treated as a number
                    return `${context.dataset.label}: ₦${value.toLocaleString()}`;
                  },
                  title: (tooltipItems) => {
                    return `Date: ${tooltipItems[0].label}`;
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#e0e0e0',
                  font: {
                    size: 12,
                  },
                  autoSkip: false, // Prevents skipping ticks
                  maxTicksLimit: 10, // Adjusts the number of ticks displayed
                },
              },
              y: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.2)',
                },
                ticks: {
                  color: '#e0e0e0',
                  font: {
                    size: 12,
                  },
                  callback: (value) => `₦${value.toLocaleString()}`,
                },
              },
            },
            elements: {
              line: {
                tension: 0.4, // Smooth line curve
              },
            },
          },
        });

        return () => {
          chart.destroy(); // Clean up chart instance
        };
      }
    }
  }, [salesData]);

  return (
    <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 w-full rounded-lg shadow-lg p-5 flex flex-col">
      <div className="relative" style={{ paddingTop: '67.25%' }}>
        <canvas ref={chartRef} className="absolute inset-0 w-full h-full rounded-lg" />
      </div>
      <div className="mt-2 text-center text-gray-200 text-sm">
        Data reflects the total sales over time.
      </div>
    </div>
  );
};

export default CustomChart;
