// src/components/TopSellingProducts.tsx
const TopSellingProducts: React.FC = () => {
    return (
      <div className="bg-white p-4 rounded-md shadow-md">
        <h3 className="text-sm text-gray-500 mb-2">Top Selling Products</h3>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="text-xs text-gray-500">Order ID</th>
              <th className="text-xs text-gray-500">Quantity</th>
              <th className="text-xs text-gray-500">Alert amt.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-sm">order ID</td>
              <td className="text-sm">Quantity</td>
              <td className="text-sm">Alert amt.</td>
            </tr>
            <tr>
              <td className="text-sm">order ID</td>
              <td className="text-sm">Quantity</td>
              <td className="text-sm">Alert amt.</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  export default TopSellingProducts;
  