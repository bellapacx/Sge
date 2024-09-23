import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();

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
                if (!token) {
                    // Redirect to login if there's no token
                    navigate('/login');
                    setLoading(false);
                    return;
                }

                const response = await fetch('https://sgebackend.onrender.com/api/current-user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserRole(data.role);
                } else {
                    console.error('Failed to fetch user role');
                    localStorage.removeItem('authToken'); // Clear invalid token
                    navigate('/login'); // Redirect to login on failure
                    setUserRole(null);
                }
            } catch (error) {
                console.error('Error fetching user role!', error);
                localStorage.removeItem('authToken');
                navigate('/login'); // Redirect to login on error
                setUserRole(null);
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        fetchUserRole();
    }, [navigate]);

    // Show a loading spinner or placeholder until we fetch the userRole
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="bg-gray-400 flex flex-col h-full">
            {userRole && <Header toggleSidebar={toggleSidebar} />}
            <div className="flex flex-1">
                {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />}
                <main className="flex-1 p-4">
                    <Routes>
                        {/* Redirect based on userRole */}
                        {userRole === 'cashier' ? (
                            <Route path="/" element={<Navigate to="/sell" />} />
                        ) : userRole === 'shopkeeper' ? (
                            <Route path="/" element={<Navigate to="/purchase" />} />
                        ) : (
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                        )}

                        {/* Authenticated routes */}
                        <Route path="/dashboard" element={<AuthenticatedRoute element={<Dashboard />} requiredRoles={["admin"]} />} />
                        <Route path="/products" element={<AuthenticatedRoute element={<Products />} requiredRoles={["admin"]} />} />
                        <Route path="/reports" element={<AuthenticatedRoute element={<SellReports />} requiredRoles={['admin']} />} />
                        <Route path="/purchase" element={<AuthenticatedRoute element={<PurchaseOrders />} requiredRoles={['admin', 'shopkeeper']} />} />
                        <Route path="/empty" element={<AuthenticatedRoute element={<Empty />} requiredRoles={['admin', 'cashier']} />} />
                        <Route path="/stores" element={<AuthenticatedRoute element={<Stores />} requiredRoles={['admin']} />} />
                        <Route path="/users" element={<AuthenticatedRoute element={<User />} requiredRoles={['admin']} />} />
                        <Route path="/vehicles" element={<AuthenticatedRoute element={<Vehicles />} requiredRoles={['admin']} />} />
                        <Route path="/sell" element={<AuthenticatedRoute element={<SellOrder />} requiredRoles={['admin', 'cashier']} />} />
                        <Route path="/subagent" element={<AuthenticatedRoute element={<SubAgents />} requiredRoles={['admin']} />} />
                        <Route path="/login" element={<Login />} />

                        {/* Redirect to /login if no match */}
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
