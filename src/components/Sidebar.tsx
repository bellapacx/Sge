import { useEffect, useState } from 'react';
import { FaHome, FaTags, FaShoppingCart, FaUsers, FaSalesforce, FaStore, FaCar, FaArrowsAltV, FaWineBottle } from 'react-icons/fa';
import SidebarLink from './SidebarLink';
import axios from 'axios';

const Sidebar = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/current-user', { withCredentials: true });
        setUserRole(response.data.role || null);
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
            <SidebarLink icon={FaSalesforce} label="Sales" to='/sell'/>
            <SidebarLink icon={FaWineBottle} label="Empty" to='/empty'/>
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
