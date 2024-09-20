import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';

// Register the ChartJS components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

interface EmptyCrateInventoryItem {
  product_id: {
    _id: string;
    name: string;
  };
  quantity: number;
}

interface EmptyCrate {
  _id: string;
  store_id: string;
  inventory: EmptyCrateInventoryItem[];
  created_at: string;
  updated_at: string;
}

interface Store {
  _id: string;
  name: string;
}

const PieChart: React.FC = () => {
  const [data, setData] = useState<{ [storeId: string]: any }>({});
  const [storeNames, setStoreNames] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        // Fetch empty crates data
        const cratesResponse = await axios.get('https://sgebackend.onrender.com/api/empty-crates');
        const emptyCrates: EmptyCrate[] = cratesResponse.data;

        // Collect unique store IDs from empty crates
        const storeIds = Array.from(new Set(emptyCrates.map(crate => crate.store_id)));
        
        // Fetch store names for each store ID
        const storeNameMap = new Map<string, string>();
        await Promise.all(
          storeIds.map(async (storeId) => {
            try {
              const storeResponse = await axios.get(`https://sgebackend.onrender.com/api/stores/${storeId}`);
              const store: Store = storeResponse.data;
              storeNameMap.set(storeId, store.name);
            } catch (error) {
              console.error(`Error fetching store ${storeId}:`, error);
            }
          })
        );
        setStoreNames(storeNameMap);

        // Process the data
        const storeDataFormatted: { [storeId: string]: any } = {};

        emptyCrates.forEach(crate => {
          const storeId = crate.store_id;
          const aggregatedData: Record<string, number> = {};

          crate.inventory.forEach(item => {
            const productName = item.product_id.name;
            if (aggregatedData[productName]) {
              aggregatedData[productName] += item.quantity;
            } else {
              aggregatedData[productName] = item.quantity;
            }
          });

          // Format data for Pie chart
          const labels = Object.keys(aggregatedData);
          const quantities = Object.values(aggregatedData);

          storeDataFormatted[storeId] = {
            labels: labels,
            datasets: [{
              data: quantities,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
            }],
          };
        });

        setData(storeDataFormatted);
      } catch (error) {
        console.error('Error fetching empty crates data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    
    <div className="flex flex-wrap gap-4 h-full overflow-y-auto max-h-96">
    
      {Object.entries(data).map(([storeId, chartData]) => (
   <div key={storeId} className="w-full sm:w-1/4 p-2">
   <div className="bg-white shadow-md rounded-md p-2 border-black ">
     <h3 className="text-lg font-semibold mb-1 truncate">{storeNames.get(storeId) || 'Unknown Store'}</h3>
     <Pie data={chartData} />
     <div className="mt-1 text-lg">
       {chartData.labels.map((label: string, index: number) => (
         <div key={index} className="flex justify-between mb-0.5">
           <span className="truncate">{label}</span>
           <span>{chartData.datasets[0].data[index]}</span>
         </div>
       ))}
     </div>
   </div>
 </div>
 
      ))}
    </div>
  );
};

export default PieChart;
