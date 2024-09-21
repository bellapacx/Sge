import React, { useEffect, useState } from 'react';
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
import SubAgents from '../pages/Subagent';

const MainLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const closeSidebar = () => {
        setIsSidebarOpen(false); // Close the sidebar
    };

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch('https://sgebackend.onrender.com/api/current-user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserRole(data.role || null);
                }
            } catch (error) {
                console.error('Error fetching user role', error);
                setUserRole(null);
            }
        };

        fetchUserRole();
    }, []);
    return (
        <div className="bg-gray-200 flex flex-col h-full">
            <Header toggleSidebar={toggleSidebar} />
            <div className="flex flex-1">
            {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />}
                <main className="flex-1 p-4">
                    <Routes>
                    {userRole === 'cashier' ? (
                            <Route path="/" element={<Navigate to="/sell" />} />
                        ) : userRole === 'shopkeeper' ? (
                            <Route path="/" element={<Navigate to="/purchase" />} />
                        ) : (
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                        )}
                        <Route path="/dashboard" element={<AuthenticatedRoute element={<Dashboard />} requiredRoles={["admin"]} />} />
                        <Route path="/products" element={<AuthenticatedRoute element={<Products />} requiredRoles={["admin"]} />} />
                        <Route path="/reports" element={<AuthenticatedRoute element={<SellReports />} requiredRoles={['admin']} />} />
                        <Route path="/purchase" element={<AuthenticatedRoute element={<PurchaseOrders />} requiredRoles={['admin','shopkeeper']} />} />
                        <Route path="/empty" element={<AuthenticatedRoute element={<Empty />} requiredRoles={['admin', 'cashier']} />} />
                        <Route path="/stores" element={<AuthenticatedRoute element={<Stores />} requiredRoles={['admin']} />} />
                        <Route path="/users" element={<AuthenticatedRoute element={<User />} requiredRoles={['admin']} />} />
                        <Route path="/vehicles" element={<AuthenticatedRoute element={<Vehicles />} requiredRoles={['admin']} />} />
                        <Route path="/sell" element={<AuthenticatedRoute element={<SellOrder />} requiredRoles={['admin','cashier']} />} />
                        <Route path="/subagent" element={<SubAgents />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
