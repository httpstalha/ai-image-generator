'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, History, User, LogOut, Menu, X, LayoutDashboard, Home } from 'lucide-react';
import { getStoredUser, DEFAULT_USER } from '@/lib/storage';
import { signOut, useSession } from 'next-auth/react';

/**
 * Navbar Component
 * Enterprise header navigation with responsive drawer, auth state handling,
 * route link protection, and exact active button state highlighting.
 */
export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(DEFAULT_USER);

  useEffect(() => {
    const authFlag = typeof window !== 'undefined' ? localStorage.getItem('cerulia_is_logged_in') : null;
    const isLocalLoggedIn = authFlag === 'true';
    const isNextAuthLoggedIn = Boolean(session?.user);

    if (isNextAuthLoggedIn && session?.user) {
      const storedUser = getStoredUser();
      setUser({
        ...storedUser,
        name: session.user.name || storedUser.name,
        email: session.user.email || storedUser.email,
        avatar: session.user.image || storedUser.avatar,
      });
      setIsLoggedIn(true);
    } else if (isLocalLoggedIn) {
      setUser(getStoredUser());
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname, session]);

  // Protected navigation items (Only displayed when user is authenticated)
  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Generate', href: '/generate', icon: Sparkles },
    { label: 'My Images', href: '/my-images', icon: History },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = async () => {
    localStorage.setItem('cerulia_is_logged_in', 'false');
    setIsLoggedIn(false);
    await signOut({ callbackUrl: '/login', redirect: false });
    window.location.href = '/login';
  };

  const isLoginPage = pathname === '/login';
  const isSignUpPage = pathname === '/signup';

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E2F1FA] pastel-shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href={isLoggedIn ? '/dashboard' : '/'} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6BB6D9] to-[#A7D8F0] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-[#172B4D] tracking-tight block">Cerulia</span>
              <span className="text-[10px] text-[#6BB6D9] font-medium tracking-wider uppercase block -mt-1">
                AI Image Generator
              </span>
            </div>
          </Link>

          {/* Protected Navigation Links (Hidden when Logged Out) */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-1 bg-[#DFF3FC]/50 p-1.5 rounded-2xl border border-[#E2F1FA]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#A7D8F0] text-[#172B4D] font-bold shadow-xs'
                        : 'text-[#5E7292] hover:text-[#172B4D] hover:bg-[#FFFFFF]/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#172B4D]' : 'text-[#6BB6D9]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Profile Controls / Auth Action Buttons */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3 bg-[#F7FBFE] border border-[#E2F1FA] py-1.5 px-3 rounded-2xl shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#A7D8F0] overflow-hidden flex items-center justify-center text-[#172B4D] font-bold text-xs">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.name ? user.name.charAt(0) : 'T'}</span>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-[#172B4D] leading-tight">{user.name}</p>
                  <p className="text-[10px] text-[#6BB6D9] font-semibold">Cerulia Member</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="p-1.5 text-[#5E7292] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Precise Active State Buttons for Logged Out View (Single active blue button at a time) */
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    isLoginPage
                      ? 'bg-[#A7D8F0] text-[#172B4D] border border-[#6BB6D9] shadow-xs'
                      : 'bg-[#F7FBFE] text-[#5E7292] hover:text-[#172B4D] hover:bg-[#DFF3FC] border border-[#E2F1FA]'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    isSignUpPage
                      ? 'bg-[#A7D8F0] text-[#172B4D] border border-[#6BB6D9] shadow-xs'
                      : isLoginPage
                      ? 'bg-[#F7FBFE] text-[#5E7292] hover:text-[#172B4D] hover:bg-[#DFF3FC] border border-[#E2F1FA]'
                      : 'bg-[#6BB6D9] text-[#FFFFFF] hover:bg-[#3B92BD] shadow-xs'
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            {isLoggedIn && (
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-[#172B4D] bg-[#DFF3FC] rounded-xl hover:bg-[#A7D8F0] transition-colors cursor-pointer"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Drawer (Only shown when logged in) */}
      {isLoggedIn && mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2F1FA] bg-[#FFFFFF] px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#A7D8F0] text-[#172B4D] font-bold'
                    : 'text-[#5E7292] hover:bg-[#DFF3FC]/50'
                }`}
              >
                <Icon className="w-4 h-4 text-[#6BB6D9]" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-[#E2F1FA]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
