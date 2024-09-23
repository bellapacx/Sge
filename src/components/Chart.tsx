import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

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
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(74, 144, 226, 0.5)'); // Light blue at top
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Transparent at bottom

        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: salesData.map((data) => data.date),
            datasets: [
              {
                label: 'Total Sales',
                data: salesData.map((data) => data.total),
                borderColor: '#4a90e2',
                borderWidth: 2,
                fill: true,
                backgroundColor: gradient,
                pointBackgroundColor: '#4a90e2',
                pointBorderColor: '#fff',
                pointRadius: 5,
                pointHoverRadius: 7,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: '#4a90e2',
                  font: {
                    size: 14,
                    family: 'Arial, sans-serif',
                  },
                },
              },
              tooltip: {
                backgroundColor: '#ffffff',
                bodyColor: '#333',
                borderColor: '#4a90e2',
                borderWidth: 1,
                displayColors: false,
                titleColor: '#333',
                padding: 10,
                cornerRadius: 5,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#8884d8',
                  font: {
                    size: 12,
                  },
                },
              },
              y: {
                grid: {
                  color: '#e0e0e0',
                },
                ticks: {
                  color: '#8884d8',
                  font: {
                    size: 12,
                  },
                },
              },
            },
            elements: {
              line: {
                tension: 0.4, // Smooth curves
              },
            },
          },
        });

        return () => {
          chart.destroy();
        };
      }
    }
  }, [salesData]);

  return (
    <div className="relative w-full h-96 bg-white rounded-lg shadow-lg p-5">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default CustomChart;
