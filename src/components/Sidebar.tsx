import { useEffect, useState } from 'react';
import { FaHome, FaTags, FaShoppingCart, FaUsers, FaSalesforce, FaStore, FaCar, FaArrowsAltV, FaWineBottle, FaUserAlt } from 'react-icons/fa';
import SidebarLink from './SidebarLink';


const Sidebar = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://sgebackend.onrender.com/api/current-user', {
          method: 'GET',

          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          credentials: 'include'
          // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role || null);
    } else {
        throw new Error('Failed to fetch user data');
    }
      
      } catch (error) {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, []);

  if (userRole === null) {
    return <div></div>; // Optionally show a loading indicator
  }

  return (
    <div className="w-54 h-screen bg-gray-700 text-white flex flex-col">
      {/* Logo or Top Section */}
      <div className="flex items-center justify-center py-4">
        {/* Add logo or top section content here */}
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col flex-grow">
        
        {userRole === 'admin' && (
          <>
          <SidebarLink icon={FaHome} label="Dashboard" to='/dashboard' />
            <SidebarLink icon={FaArrowsAltV} label="Reports" to='/reports'/>
            <SidebarLink icon={FaTags} label="Products" to='/products'/>
            <SidebarLink icon={FaShoppingCart} label="Orders" to='/purchase'/>
            <SidebarLink icon={FaSalesforce} label="Sales" to='/sell'/>
            <SidebarLink icon={FaStore} label="Stores" to='/stores'/>
            <SidebarLink icon={FaUsers} label="Users" to='/users'/>
            <SidebarLink icon={FaCar} label="Vehicles" to='/vehicles'/>
            <SidebarLink icon={FaWineBottle} label="Empty" to='/empty'/>
            <SidebarLink icon={FaUserAlt} label="Subagent" to='/subagent'/>
          </>
        )}
        {userRole === 'cashier' && (
          <>
            <SidebarLink icon={FaSalesforce} label="Sales" to='/sell'/>
          </>
        )}
        {userRole === 'shopkeeper' && (
          <>
            <SidebarLink icon={FaShoppingCart} label="Orders" to='/purchase'/>
          </>
        )}
        {/* Add other roles and their corresponding links here */}
      </nav>
    </div>
  );
};

export default Sidebar;
