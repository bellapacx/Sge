import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                
                const token = localStorage.getItem('authToken');
                const response = await fetch('https://sgebackend.onrender.com/api/current-user', {
                    method: 'GET',                  
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    // Ensure cookies are sent with the request
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username);
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user', error);
                setUsername(null);
                setError('Not authenticated. Please log in.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            // Simply remove the token from localStorage
            localStorage.removeItem('authToken'); 
    
            // Optionally, you can also perform any server-side logout operation if needed
            // const response = await fetch('https://sgebackend.onrender.com/api/logout', {
            //     method: 'POST',
            //     headers: {
            //         'Authorization': `Bearer ${localStorage.getItem('token')}`
            //     }
            // });
    
            // if (!response.ok) {
            //     throw new Error('Logout failed');
            // }
    
            setUsername(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
            setError('Logout failed. Please try again.');
        }
    };
    
    

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="w-full flex flex-col md:flex-row justify-between items-center p-4 bg-green-700 mt-0 space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2">
            <div className="bg-gray-300 p-2 rounded-md">☰</div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="rounded-full bg-gray-300 p-2">🔔</div>
            <div className="flex items-center">
                {loading ? (
                    <span className="ml-2 text-white">Loading...</span>
                ) : error ? (
                    <span className="ml-2 text-red-500">{error}</span>
                ) : (
                    <span className="ml-2 text-white">{username ? username : 'Guest'}</span>
                )}
            </div>
            {username ? (
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                    Logout
                </button>
            ) : (
                <button
                    onClick={handleLogin}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Login
                </button>
            )}
        </div>
    </div>
    
    );
};

export default Header;
