import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  totalSold: number; // Total quantity sold
}

const TopSellingProducts: React.FC = () => {
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/sorders');
        const sellOrders = response.data;

        // Calculate total sold for each product
        const productSales: { [key: string]: number } = {};
        sellOrders.forEach((order: any) => {
          const productId = order.product_id._id;
          productSales[productId] = (productSales[productId] || 0) + (order.quantity || 0);
        });

        // Fetch product details
        const productIds = Object.keys(productSales);
        const productResponse = await axios.get('https://sgebackend.onrender.com/api/products');
        const products = productResponse.data;

        // Create an array of top-selling products
        const topSelling = products
          .filter((product: any) => productIds.includes(product._id))
          .map((product: any) => ({
            _id: product._id,
            name: product.name,
            totalSold: productSales[product._id],
          }))
          .sort((a: Product, b: Product) => b.totalSold - a.totalSold) // Explicitly define types for sorting
          .slice(0, 5); // Get top 5

        setTopProducts(topSelling);
      } catch (error) {
        console.error("Error fetching top selling products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {topProducts.map(product => (
            <li key={product._id} className="flex justify-between py-2 border-b">
              <span>{product.name}</span>
              <span>{product.totalSold} sold</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopSellingProducts;
