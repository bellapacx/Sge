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
        let isMounted = true; // Track whether the component is mounted

        const checkAuthentication = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('https://sgebackend.onrender.com/api/current-user', { 
                headers: {
                        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
                      },
                withCredentials: true });
                // Debugging
                if (isMounted) {
                    setIsAuthenticated(true);
                    setUserRole(response.data.role || ''); // Adjust if role is named differently
                }
            } catch (error) {
                console.log('Authentication error:', error); // Debugging
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
        return <div></div>;
    }

    console.log('User role:', userRole); // Debugging
    console.log('Required roles:', requiredRoles); // Debugging

    if (!isAuthenticated || (requiredRoles.length > 0 && !requiredRoles.includes(userRole))) {
        return <Navigate to="/login" />;
    }

    return element;
};

export default AuthenticatedRoute;
