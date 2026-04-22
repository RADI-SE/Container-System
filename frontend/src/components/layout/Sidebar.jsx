import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  LogOut,
  Package
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore"; 

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
 
  const { user, logout } = useAuthStore();

  const menuByRole = {
    admin: [ 
      { name: "Manage Containers", path: "/containers", icon: <Package size={18} /> },
    ],
 
    staff: [
 
      { name: "My Containers", path: "/staff-containers", icon: <Package size={18} /> },
      { name: "Manage Inventory", path: "/inventory", icon: <Package size={18} /> },
    ]
  };

  const menu = menuByRole[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-white shadow-md p-4 flex flex-col justify-between">
 
      <div>
        <h1 className="text-xl font-bold mb-6">Container System</h1>

        <div className="flex flex-col gap-1">
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </div> 
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 px-3 py-2 hover:bg-red-50 rounded-lg text-sm font-medium"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}