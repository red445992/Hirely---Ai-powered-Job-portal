"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  User as UserIcon,
  Settings,
  LogOut,
  Briefcase,
  ChevronDown,
} from "lucide-react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  if (!user) return null;

  const displayName =
    user.username || user.first_name || user.firstName || user.email?.split("@")[0] || "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar/Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors group"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold shadow-md">
          {initials}
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-lg font-medium text-neutral-800">
            {displayName.length > 12
              ? `${displayName.substring(0, 12)}...`
              : displayName}
          </p>
          <p className="text-xs text-neutral-500 capitalize">
            {user.user_type}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-neutral-500 transition-transform duration-200 hidden lg:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 top-full mt-2 w-82 bg-white rounded-lg shadow-xl border border-neutral-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-neutral-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-md">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-800 truncate">
                    {user.username || user.first_name || user.firstName || "User"}
                  </p>
                  <p className="text-sm text-neutral-600 truncate">
                    {user.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full capitalize">
                    {user.user_type}
                  </span>
                </div>
              </div>
            </div>

            {/* Dropdown Links */}
            <div className="py-2">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <UserIcon className="w-4 h-4 text-neutral-500" />
                My Profile
              </Link>

              {user.user_type === "candidate" && (
                <Link
                  href="/my-applications"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Briefcase className="w-4 h-4 text-neutral-500" />
                  My Applications
                </Link>
              )}

              {user.user_type === "employer" && (
                <Link
                  href="/employer/dashboard"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Briefcase className="w-4 h-4 text-neutral-500" />
                  Employer Dashboard
                </Link>
              )}

              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4 text-neutral-500" />
                Settings
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t border-neutral-100 pt-2 mt-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}