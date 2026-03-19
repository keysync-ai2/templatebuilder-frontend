'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import * as api from '@/lib/api';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    api.logout();
    setShowProfile(false);
    router.push('/auth/login');
  };

  const navItems = [
    { href: '/chat', label: 'Chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { href: '/templates', label: 'Templates', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  ];

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-0 flex items-center justify-between h-14">
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TB</span>
          </div>
          <span className="text-lg font-bold text-gray-100 hidden sm:block">Template Builder</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href || (href === '/chat' && pathname === '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                </svg>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: Profile */}
      <div className="flex items-center gap-2" ref={profileRef}>
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-300 hidden sm:block max-w-[120px] truncate">
              {user?.name || user?.email || 'Account'}
            </span>
            <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform ${showProfile ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-xl py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-sm font-medium text-gray-200">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/templates"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  My Templates
                </Link>
              </div>
              <div className="border-t border-gray-700 py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
