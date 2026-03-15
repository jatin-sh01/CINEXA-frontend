import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
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
  FiMenu,
  FiX,
} from "react-icons/fi";
import CinexaLogo from "../components/shared/CinexaLogo";
import "../admin/admin-theme.css";

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
  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl admin-menu-text font-medium transition-all duration-200 ${
    isActive
      ? "admin-nav-active"
      : "admin-muted hover:text-slate-900 hover:bg-slate-100/80"
  }`;

export default function AdminLayout() {
  const { logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const visibleItems = navItems.filter((item) =>
    item.adminOnly ? isAdmin : true,
  );

  const currentItem = useMemo(
    () =>
      visibleItems.find((item) =>
        item.end
          ? location.pathname === item.to
          : location.pathname.startsWith(item.to),
      ) || visibleItems[0],
    [location.pathname, visibleItems],
  );

  return (
    <div className="admin-shell min-h-screen pt-16 lg:pt-0">
      {/* Hamburger menu now inside header below */}

      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity duration-200 lg:hidden ${mobileOpen ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0"}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-60 h-screen w-72 admin-surface flex flex-col px-4 py-5 transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-end px-2">
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <FiX size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              <span className="rounded-lg bg-slate-100/80 p-1.5 text-slate-600">
                <item.icon size={16} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 space-y-1.5 border-t border-slate-200 pt-4">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 admin-menu-text font-medium admin-muted hover:bg-slate-100/80 hover:text-slate-900 transition duration-200"
          >
            <span className="rounded-lg bg-slate-100/80 p-1.5 text-slate-600">
              <FiHome size={16} />
            </span>
            <span>Back to Site</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 admin-menu-text font-medium text-rose-600 hover:bg-rose-50 transition duration-200"
          >
            <span className="rounded-lg bg-rose-50 p-1.5 text-rose-600">
              <FiLogOut size={16} />
            </span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <header className="px-4 pt-4 md:px-6 lg:px-8">
          <div className="admin-glass rounded-2xl px-4 py-4 md:px-6 md:py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                {/* Hamburger menu for mobile */}
                <button
                  onClick={() => setMobileOpen(true)}
                  className="lg:hidden admin-glass rounded-xl p-2.5 text-slate-700"
                  aria-label="Open menu"
                  style={{ marginLeft: "-0.5rem" }}
                >
                  <FiMenu size={20} />
                </button>
                <div>
                  <p className="admin-muted text-sm">
                    Admin /{" "}
                    <span className="font-semibold admin-heading">
                      {currentItem?.label || "Dashboard"}
                    </span>
                  </p>
                  <h1 className="admin-title mt-1">
                    {currentItem?.label || "Dashboard"}
                  </h1>
                </div>
              </div>
              <div className="flex w-full items-center justify-end md:w-auto" />
            </div>
          </div>
        </header>

        <section className="px-4 pb-8 pt-6 md:px-6 lg:px-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
