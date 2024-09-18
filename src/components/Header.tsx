import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios'; // Import axios for making HTTP requests

const Header: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Fetch the current user when the component mounts
        const fetchUser = async () => {
            try {
                const response = await axios.get('https://sgebackend.onrender.com/api/current-user', { withCredentials: true });
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching user', error);
                setUsername(null); // Handle case where user is not authenticated
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('https://sgebackend.onrender.com/api/logout', {}, { withCredentials: true }); // Adjust URL as necessary
            setUsername(null); // Clear username from state
            navigate('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error('Logout failed', error);
            // Handle logout failure
        }
    };

    return (
        <div className="w-full flex justify-between items-center p-4 bg-gray-700">
            <div className="flex items-center space-x-2">
                <div className="bg-gray-300 p-2 rounded-md">☰</div>
                <input type="text" placeholder="Search..." className="border rounded-md p-2" />
            </div>
            <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-300 p-2">🔔</div>
                <div className="flex items-center">
                    {/*<img src="/path-to-image" alt="User" className="rounded-full h-8 w-8" />*/}
                    <span className="ml-2 text-white">{username ? username : 'Guest'}</span>
                </div>
                {username && (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
};

export default Header;
