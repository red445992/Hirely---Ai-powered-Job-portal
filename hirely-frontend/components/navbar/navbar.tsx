"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import UserDropdown from "@/components/navbar/userdropdown";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);
  const isActive = (path: string) => pathname === path;

  // ✅ BEST APPROACH: Conditionally get nav links based on user type
  const getNavLinks = () => {
    if (!mounted) {
      // Return minimal links during SSR to avoid hydration mismatch
      return [{ href: "/", label: "Home" }];
    }

    if (user?.user_type === "employer") {
      // Employers only see Dashboard
      return [{ href: "/dashboard/employer", label: "Dashboard" }];
    }

    if (user?.user_type === "candidate") {
      // Candidates see regular nav + Applications + Resumes
      return [
        { href: "/jobs", label: "Jobs" },
        { href: "/applications", label: "Applications" },
        { href: "/resumes", label: "Resumes" },
        { href: "/ai_interview", label: "AI Interview" }
      ];
    }


    // Non-authenticated users see regular nav
    return [
      { href: "/jobs", label: "Jobs" },
    ];
  };

  const navLinks = getNavLinks();

  const handleMobileLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav className="w-full fixed top-0 left-0 py-3 bg-white border-b z-50 shadow-sm">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Hirely Logo"
              width={120}
              height={32}
              className="object-contain w-30 sm:w-36 md:w-55 h-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xl font-medium relative transition-colors ${
                  isActive(link.href)
                    ? "text-blue-600 font-semibold"
                    : "text-neutral-700 hover:text-blue-500"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-[14px] left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {mounted && isAuthenticated ? (
              <UserDropdown />
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-base font-medium text-neutral-700 hover:text-blue-500 transition-colors"
                >
                  Login
                </Link>
                <Button
                  asChild
                  className="gradient-primary gradient-primary-hover text-white shadow-md transition-all duration-200 text-base font-medium px-6 py-2"
                >
                  <Link href="/auth/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden inline-flex p-2 rounded-md border border-neutral-200 hover:bg-neutral-50 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-b border-neutral-200 shadow-lg">
          <div className="px-6 py-4 flex flex-col gap-2">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 px-4 rounded-lg transition-all duration-200 text-base font-medium ${
                  isActive(link.href)
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-neutral-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600"
                }`}
                onClick={closeMenu}
              >
                <span className="flex items-center justify-between">
                  {link.label}
                  {isActive(link.href) && (
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  )}
                </span>
              </Link>
            ))}

            {/* Auth Section */}
            <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-neutral-200">
              {mounted && isAuthenticated ? (
                <>
                  {/* Mobile User Info */}
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <p className="font-semibold text-neutral-800 truncate">
                      {user?.username || user?.first_name || user?.email}
                    </p>
                    <p className="text-sm text-neutral-600 truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-blue-600 font-medium capitalize mt-1">
                      {user?.user_type}
                    </p>
                  </div>

                  {/* Additional mobile-only links */}
                  {user?.user_type === "employer" && (
                    <Link
                      href="/dashboard/employer"
                      className="py-3 px-4 text-center text-base font-medium text-neutral-700 hover:text-blue-600 transition-colors border border-neutral-200 rounded-lg hover:bg-neutral-50"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                  )}

                  {user?.user_type === "candidate" && (
                    <Link
                      href="/applications"
                      className="py-3 px-4 text-center text-base font-medium text-neutral-700 hover:text-blue-600 transition-colors border border-neutral-200 rounded-lg hover:bg-neutral-50"
                      onClick={closeMenu}
                    >
                      My Applications
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    className="py-3 px-4 text-center text-base font-medium text-neutral-700 hover:text-blue-600 transition-colors border border-neutral-200 rounded-lg hover:bg-neutral-50"
                    onClick={closeMenu}
                  >
                    My Profile
                  </Link>

                  <Link
                    href="/settings"
                    className="py-3 px-4 text-center text-base font-medium text-neutral-700 hover:text-blue-600 transition-colors border border-neutral-200 rounded-lg hover:bg-neutral-50"
                    onClick={closeMenu}
                  >
                    Settings
                  </Link>

                  <Button
                    onClick={handleMobileLogout}
                    className="bg-red-600 hover:bg-red-700 text-white shadow-md transition-all duration-200 text-base font-medium py-3"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="py-3 px-4 text-center text-base font-medium text-neutral-700 hover:text-blue-600 transition-colors border border-neutral-200 rounded-lg hover:bg-neutral-50"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Button
                    asChild
                    className="gradient-primary gradient-primary-hover text-white shadow-md transition-all duration-200 text-base font-medium py-3"
                  >
                    <Link href="/auth/register" onClick={closeMenu}>
                      Register
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}