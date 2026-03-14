import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiFilm,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiLogOut,
  FiHome,
  FiBarChart2,
  FiShoppingCart,
  FiTrendingUp,
  FiAlertOctagon,
  FiSettings,
} from "react-icons/fi";
import CinexaLogo from "../components/shared/CinexaLogo";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: FiBarChart2, end: true },
  { to: "/admin/movies", label: "Movies", icon: FiFilm },
  { to: "/admin/theaters", label: "Theaters", icon: FiMapPin },
  { to: "/admin/shows", label: "Shows", icon: FiCalendar },
  { to: "/admin/users", label: "Users", icon: FiUsers, adminOnly: true },
  { to: "/admin/bookings", label: "Bookings", icon: FiShoppingCart },
  { to: "/admin/analytics", label: "Analytics", icon: FiTrendingUp },
  {
    to: "/admin/moderation",
    label: "Moderation",
    icon: FiAlertOctagon,
    adminOnly: true,
  },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
    isActive
      ? "bg-purple-600 text-white shadow-md"
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  }`;


export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const visibleItems = navItems.filter((item) =>
    item.adminOnly ? isAdmin : true,
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-linear-to-r from-purple-50 to-blue-50">
          <CinexaLogo className="h-6 w-auto text-gray-900" />
          <p className="text-xs font-semibold text-purple-700 mt-1">
            Admin Panel
          </p>
          <p className="text-xs text-gray-600 mt-1">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            <FiHome size={18} />
            Back to Site
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition"
          >
            <FiLogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
