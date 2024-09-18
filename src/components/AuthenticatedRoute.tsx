import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

interface AuthenticatedRouteProps {
    element: React.ReactElement;
    requiredRoles?: string[]; // Allow multiple roles
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ element, requiredRoles = [] }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.get('https://sgebackend.onrender.com/api/current-user', { withCredentials: true });
                console.log('API Response:', response.data); // Debugging
                setIsAuthenticated(true);
                setUserRole(response.data.role || '');
            } catch (error) {
                console.log('Authentication error:', error); // Debugging
                setIsAuthenticated(false);
            }
        };

        checkAuthentication();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    console.log('User role:', userRole); // Debugging
    console.log('Required roles:', requiredRoles); // Debugging

    if (!isAuthenticated || (requiredRoles.length > 0 && !requiredRoles.includes(userRole))) {
        return <Navigate to="/login" />;
    }

    return element;
};

export default AuthenticatedRoute;
