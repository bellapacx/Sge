import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Login from '../pages/LoginForm';
import AuthenticatedRoute from '../components/AuthenticatedRoute';
import SellReports from '../pages/SellReports';
import PurchaseOrders from '../pages/PurchaseOrder';
import Empty from '../pages/Empty';
import Stores from '../pages/Stores';
import User from '../pages/User';
import Vehicles from '../pages/Vehicles';
import SellOrder from '../pages/SellOrder';

const MainLayout: React.FC = () => {
    return (
        <div className="bg-gray-200 flex flex-col h-full">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-4">
                    <Routes>
                        <Route path="/" element={<Navigate to="Sge/dashboard" />} />
                        <Route path="Sge/dashboard" element={<AuthenticatedRoute element={<Dashboard />} requiredRoles={['admin', ]} />} />
                        <Route path="Sge/products" element={<AuthenticatedRoute element={<Products />} requiredRoles={["admin"]} />} />
                        <Route path="Sge/reports" element={<AuthenticatedRoute element={<SellReports />} requiredRoles={['admin']} />} />
                        <Route path="Sge/purchase" element={<AuthenticatedRoute element={<PurchaseOrders />} requiredRoles={['admin','shopkeeper']} />} />
                        <Route path="Sge/empty" element={<AuthenticatedRoute element={<Empty />} requiredRoles={['admin', 'cashier']} />} />
                        <Route path="Sge/stores" element={<AuthenticatedRoute element={<Stores />} requiredRoles={['admin']} />} />
                        <Route path="Sge/users" element={<AuthenticatedRoute element={<User />} requiredRoles={['admin']} />} />
                        <Route path="Sge/vehicles" element={<AuthenticatedRoute element={<Vehicles />} requiredRoles={['admin']} />} />
                        <Route path="Sge/sell" element={<AuthenticatedRoute element={<SellOrder />} requiredRoles={['admin','cashier']} />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
