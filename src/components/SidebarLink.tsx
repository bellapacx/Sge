import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';

interface SidebarLinkProps {
  icon: IconType;
  label: string;
  to: string; // Add 'to' prop for routing
  closeSidebar: () => void; // New prop
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon: Icon, label, to, closeSidebar}) => {
  return (
    <Link
      to={to} // Use 'to' prop for navigation
      className="flex items-center px-4 py-2 hover:bg-gray-800 transition-colors"
      onClick={closeSidebar}
    >
      <Icon className="mr-3 w-6 h-6" />
      <span>{label}</span>
    </Link>
  );
};

export default SidebarLink;
