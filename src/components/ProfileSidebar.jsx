import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FiArrowLeft,
  FiFileText,
  FiMessageSquare,
  FiHelpCircle,
  FiShield,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import ContentModal from "./shared/ContentModal";
import { TERMS_CONTENT, PRIVACY_CONTENT } from "../lib/modalContent";

export default function ProfileSidebar({ user, onClose, onLogout }) {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      
      <div className="relative z-10 w-full max-w-sm bg-white h-full shadow-2xl animate-slide-in-right flex flex-col">
        
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <button
            onClick={onClose}
            aria-label="Close profile"
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition"
          >
            <FiArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
        </div>

        
        <div className="flex items-center gap-4 px-5 py-5">
          <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold text-gray-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>

        
        <div className="flex-1 overflow-y-auto px-3">
          
          <SidebarLink
            to="/dashboard"
            icon={<FiFileText size={18} />}
            label="View all bookings"
            onClick={onClose}
          />

          
          <SectionTitle>Support</SectionTitle>
          <SidebarLink
            to="/dashboard"
            icon={<FiMessageSquare size={18} />}
            label="Chat with us"
            onClick={onClose}
          />

          
          <SectionTitle>More</SectionTitle>
          <button
            onClick={() => setShowTerms(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="text-gray-500"><FiHelpCircle size={18} /></span>
              Terms & Conditions
            </div>
            <FiChevronRight size={16} className="text-gray-400" />
          </button>
          <button
            onClick={() => setShowPrivacy(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="text-gray-500"><FiShield size={18} /></span>
              Privacy Policy
            </div>
            <FiChevronRight size={16} className="text-gray-400" />
          </button>
        </div>

        
        <div className="px-3 pb-5">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
          >
            <FiLogOut size={18} className="text-gray-500" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      
      <ContentModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms & Conditions"
      >
        {TERMS_CONTENT}
      </ContentModal>
      <ContentModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy Policy"
      >
        {PRIVACY_CONTENT}
      </ContentModal>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide px-4 pt-5 pb-2">
      {children}
    </h3>
  );
}

function SidebarLink({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition"
    >
      <div className="flex items-center gap-3 text-sm font-medium">
        <span className="text-gray-500">{icon}</span>
        {label}
      </div>
      <FiChevronRight size={16} className="text-gray-400" />
    </Link>
  );
}
