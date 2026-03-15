import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiSearch,
  FiUser,
  FiFilm,
  FiMonitor,
  FiBookOpen,
} from "react-icons/fi";
import AuthModal from "./AuthModal";
import ProfileSidebar from "./ProfileSidebar";
import CinexaLogo from "./shared/CinexaLogo";

const navLinkClass = ({ isActive }) =>
  `px-3 py-1.5 rounded-full text-sm transition ${isActive ? "bg-gray-900 text-white font-semibold" : "text-gray-600 hover:text-gray-900"}`;

const bottomLinkClass = ({ isActive }) =>
  `mobile-nav-item flex min-w-[70px] flex-col items-center justify-center gap-0.5 py-1 text-[11px] leading-none font-normal transition ${isActive ? "text-gray-900" : "text-gray-400"}`;

const bottomButtonClass =
  "mobile-nav-item flex min-w-[70px] flex-col items-center justify-center gap-0.5 py-1 text-[11px] leading-none font-normal text-gray-400 transition";

const bottomIconClass = "h-4 w-4";
const bottomLabelClass = "text-[11px] leading-none font-normal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/movies?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMobileSearch(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="w-full px-2 sm:px-2 lg:px-6 xl:px-10 flex items-center h-14 lg:h-16 gap-6 lg:gap-8">
          <Link to="/" className="shrink-0">
            <CinexaLogo className="h-6 lg:h-7 w-auto text-gray-900" />
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-sm font-medium mx-auto ml-16">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/movies" className={navLinkClass}>
              Movies
            </NavLink>
            <NavLink to="/theaters" className={navLinkClass}>
              Theatres
            </NavLink>
            {user && (
              <NavLink to="/dashboard" className={navLinkClass}>
                Orders
              </NavLink>
            )}
          </div>

          <div className="flex-1" />

          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center relative w-72 lg:w-80"
          >
            <FiSearch
              size={15}
              className="absolute left-3 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for movies, cinemas and more"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-sm border border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition"
            />
          </form>

          <div className="flex lg:hidden items-center gap-3">
            <button
              aria-label="Search"
              onClick={() => setMobileSearch((v) => !v)}
              className="w-9 h-9 flex items-center justify-center text-gray-600"
            >
              <FiSearch size={20} />
            </button>
          </div>

          {user ? (
            <button
              onClick={() => setShowProfile(true)}
              aria-label="Profile"
              className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition font-bold text-sm"
            >
              {user.name?.charAt(0)?.toUpperCase() || <FiUser size={18} />}
            </button>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              aria-label="Login"
              className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
            >
              <FiUser size={18} />
            </button>
          )}
        </div>

        {mobileSearch && (
          <div className="lg:hidden px-4 py-2 bg-white border-b border-gray-100">
            <form onSubmit={handleSearch} className="relative">
              <FiSearch
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for movies, cinemas and more"
                autoFocus
                className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition"
              />
            </form>
          </div>
        )}
      </nav>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 safe-bottom">
        <div className="flex items-center justify-around h-14 px-2">
          <NavLink to="/" end className={bottomLinkClass}>
            <FiFilm className={bottomIconClass} />
            <span className={bottomLabelClass}>Home</span>
          </NavLink>
          <NavLink to="/theaters" className={bottomLinkClass}>
            <FiMonitor className={bottomIconClass} />
            <span className={bottomLabelClass}>Theatres</span>
          </NavLink>
          {user ? (
            <NavLink to="/dashboard" className={bottomLinkClass}>
              <FiBookOpen className={bottomIconClass} />
              <span className={bottomLabelClass}>Bookings</span>
            </NavLink>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className={bottomButtonClass}
            >
              <FiBookOpen className={bottomIconClass} />
              <span className={bottomLabelClass}>Bookings</span>
            </button>
          )}
          {user ? (
            <button
              onClick={() => setShowProfile(true)}
              className={bottomButtonClass}
            >
              <FiUser className={bottomIconClass} />
              <span className={bottomLabelClass}>Profile</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className={bottomButtonClass}
            >
              <FiUser className={bottomIconClass} />
              <span className={bottomLabelClass}>Profile</span>
            </button>
          )}
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {showProfile && (
        <ProfileSidebar
          user={user}
          onClose={() => setShowProfile(false)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
