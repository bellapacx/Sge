// src/components/StockAlert.tsx
const StockAlert: React.FC = () => {
    return (
      <div className="bg-white p-4 rounded-md shadow-md">
        <h3 className="text-sm text-gray-500 mb-2">Stock Alert</h3>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="text-xs text-gray-500">Order ID</th>
              <th className="text-xs text-gray-500">Date</th>
              <th className="text-xs text-gray-500">Quantity</th>
              <th className="text-xs text-gray-500">Alert amt.</th>
              <th className="text-xs text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-sm">order ID</td>
              <td className="text-sm">Date</td>
              <td className="text-sm">Quantity</td>
              <td className="text-sm">Alert amt.</td>
              <td className="text-sm">Status</td>
            </tr>
            <tr>
              <td className="text-sm">order ID</td>
              <td className="text-sm">Date</td>
              <td className="text-sm">Quantity</td>
              <td className="text-sm">Alert amt.</td>
              <td className="text-sm">Status</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  export default StockAlert;
  