import { useEffect, useState } from 'react';
import { FaHome, FaTags, FaShoppingCart, FaUsers, FaSalesforce, FaStore, FaCar, FaArrowsAltV, FaWineBottle, FaUserAlt } from 'react-icons/fa';
import SidebarLink from './SidebarLink';

interface SidebarProps {
  isOpen: boolean; // Add this prop type
  closeSidebar: () => void; // New prop
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

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
          credentials: 'include',
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
    <div className={`w-54 h-screen bg-gray-700 text-white flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-center py-4">
        {/* Add logo or top section content here */}
      </div>

      <nav className="flex flex-col flex-grow">
        {userRole === 'admin' && (
          <>
            <SidebarLink icon={FaHome} label="Dashboar" to='/dashboard' closeSidebar={closeSidebar}/>
            <SidebarLink icon={FaArrowsAltV} label="Reports" to='/reports' closeSidebar={closeSidebar}/>
            <SidebarLink icon={FaTags} label="Products" to='/products' closeSidebar={closeSidebar}/>
            <SidebarLink icon={FaShoppingCart} label="Orders" to='/purchase' closeSidebar={closeSidebar}/>
            <SidebarLink icon={FaSalesforce} label="Sales" to='/sell' closeSidebar={closeSidebar}/>
            <SidebarLink icon={FaStore} label="Stores" to='/stores' closeSidebar={closeSidebar}/>
            <SidebarLink icon={FaUsers} label="Users" to='/users' closeSidebar={closeSidebar}/>
            <SidebarLink icon={FaCar} label="Vehicles" to='/vehicles' closeSidebar={closeSidebar}/>
            <SidebarLink icon={FaWineBottle} label="Empty" to='/empty' closeSidebar={closeSidebar}/>
            <SidebarLink icon={FaUserAlt} label="Subagent" to='/subagent' closeSidebar={closeSidebar}/>
          </>
        )}
        {userRole === 'cashier' && (
          <>
            <SidebarLink icon={FaSalesforce} label="Sales" to='/sell' closeSidebar={closeSidebar}/>
          </>
        )}
        {userRole === 'shopkeeper' && (
          <>
            <SidebarLink icon={FaShoppingCart} label="Orders" to='/purchase' closeSidebar={closeSidebar}/>
          </>
        )}
        {/* Add other roles and their corresponding links here */}
      </nav>
    </div>
  );
};

export default Sidebar;
