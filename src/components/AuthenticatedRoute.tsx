import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthenticatedRouteProps {
    element: React.ReactElement;
    requiredRoles?: string[]; // Allow multiple roles
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ element, requiredRoles = [] }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        let isMounted = true; // Track whether the component is mounted

        const checkAuthentication = async () => {
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
                    if (isMounted) {
                        setIsAuthenticated(true);
                        setUserRole(data.role || ''); // Adjust if role is named differently
                    }
                } else {
                    throw new Error('Failed to fetch user data');
                }
                
            } catch (error) {
                console.log('Authentication error:', error);
                if (isMounted) {
                    setIsAuthenticated(false);
                }
            }
        };

        checkAuthentication();

        return () => {
            isMounted = false; // Cleanup function to avoid setting state after unmount
        };
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Optionally show a loading state
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Role-based navigation
    if (userRole === 'admin') {
        return <Navigate to="/dashboard" />;
    } else if (userRole === 'cashier') {
        return <Navigate to="/sell" />;
    } else if (userRole === 'shopkeeper') {
        return <Navigate to="/purchase" />;
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
        return <Navigate to="/login" />;
    }

    return element;
};

export default AuthenticatedRoute;
