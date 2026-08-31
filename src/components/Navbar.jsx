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
  `px-3.5 py-1.5 rounded-full text-sm font-medium transition duration-150 ${isActive ? "bg-gray-950 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`;

const bottomLinkClass = ({ isActive }) =>
  `mobile-nav-item flex min-w-[64px] min-h-[48px] flex-col items-center justify-center gap-1 py-1 text-xs transition duration-150 cursor-pointer ${isActive ? "text-gray-950 font-bold" : "text-gray-500 hover:text-gray-900 font-medium"}`;

const bottomButtonClass =
  "mobile-nav-item flex min-w-[64px] min-h-[48px] flex-col items-center justify-center gap-1 py-1 text-xs text-gray-500 hover:text-gray-900 font-medium transition duration-150 cursor-pointer";

const bottomIconClass = "h-5 w-5";
const bottomLabelClass = "text-[11px] leading-none";

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
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200/80 shadow-2xs">
        <div className="w-full px-4 lg:px-8 xl:px-10 flex items-center h-14 lg:h-16 gap-6 lg:gap-8">
          <Link to="/" className="shrink-0">
            <CinexaLogo className="h-6 lg:h-7 w-auto text-gray-900" />
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium mx-auto ml-12">
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
              className="absolute left-3.5 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for movies, cinemas..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 transition"
            />
          </form>

          <div className="flex lg:hidden items-center gap-2">
            <button
              aria-label="Search"
              onClick={() => setMobileSearch((v) => !v)}
              className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-950 active:scale-95 transition"
            >
              <FiSearch size={20} />
            </button>
          </div>

          {user ? (
            <button
              onClick={() => setShowProfile(true)}
              aria-label="Profile"
              className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition font-bold text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950"
            >
              {user.name?.charAt(0)?.toUpperCase() || <FiUser size={18} />}
            </button>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              aria-label="Login"
              className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950"
            >
              <FiUser size={18} />
            </button>
          )}
        </div>

        {mobileSearch && (
          <div className="lg:hidden px-4 py-2.5 bg-white border-b border-gray-200">
            <form onSubmit={handleSearch} className="relative">
              <FiSearch
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for movies, cinemas..."
                autoFocus
                className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 transition"
              />
            </form>
          </div>
        )}
      </nav>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200/90 safe-bottom shadow-lg">
        <div className="flex items-center justify-around h-16 px-2">
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
