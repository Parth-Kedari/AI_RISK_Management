import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaUserCircle, FaSignOutAlt, FaHistory, FaChevronDown } from 'react-icons/fa';

const Header = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login'; // Force reload to login page after signout
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Check if current route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Dashboard', show: true },
    { path: '/upload', label: 'Upload Document', show: user },
    { path: '/history', label: 'History', show: user },
  ];

  return (
    <header className="bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-16"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-500/10 to-purple-500/20"></div>
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Main Header Content */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
          {/* Brand Section */}
          <div className="flex items-center mb-6 lg:mb-0">
            <div className="relative">
              <div className="bg-gradient-to-br from-white/20 to-white/5 p-4 rounded-2xl mr-6 shadow-lg backdrop-blur-sm border border-white/10">
                <FaShieldAlt className="text-4xl text-white drop-shadow-lg" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full shadow-lg animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                AI Risk Assessment
              </h1>
              <p className="text-indigo-200 mt-2 font-medium text-lg max-w-md">
                Intelligent document analysis for comprehensive security evaluation
              </p>
            </div>
          </div>

          {/* User Authentication Section */}
          {user ? (
            <div className="relative user-dropdown">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="group flex items-center space-x-4 bg-white/10 hover:bg-white/20 transition-all duration-300 px-6 py-3 rounded-xl text-white border border-white/20 shadow-lg backdrop-blur-sm hover:shadow-xl hover:scale-105"
              >
                <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full p-2 shadow-inner">
                  <FaUserCircle className="text-xl" />
                </div>
                <div className="text-left">
                  <span className="font-semibold block">{user.name}</span>
                  <span className="text-indigo-200 text-sm">Administrator</span>
                </div>
                <FaChevronDown className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl py-2 z-20 border border-white/20 transition-all duration-200 ease-out animate-in slide-in-from-top-2">
                  <Link
                    to="/history"
                    className="flex items-center w-full px-6 py-4 text-gray-800 hover:bg-indigo-50 text-left transition-colors group"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="bg-indigo-100 p-2 rounded-lg mr-3 group-hover:bg-indigo-200 transition-colors">
                      <FaHistory className="text-indigo-600" />
                    </div>
                    <div>
                      <span className="font-medium">View History</span>
                      <p className="text-sm text-gray-500">Access previous reports</p>
                    </div>
                  </Link>
                  <hr className="my-2 mx-4 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-6 py-4 text-gray-800 hover:bg-red-50 text-left transition-colors group"
                  >
                    <div className="bg-red-100 p-2 rounded-lg mr-3 group-hover:bg-red-200 transition-colors">
                      <FaSignOutAlt className="text-red-600" />
                    </div>
                    <div>
                      <span className="font-medium">Sign Out</span>
                      <p className="text-sm text-gray-500">End your session</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="bg-white/10 hover:bg-white/20 transition-all duration-300 px-6 py-3 rounded-xl text-white border border-white/20 shadow-lg backdrop-blur-sm hover:shadow-xl font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-white to-indigo-100 text-indigo-900 hover:from-indigo-50 hover:to-white transition-all duration-300 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => 
            item.show && (
              <Link
                key={item.path}
                to={item.path}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActiveRoute(item.path)
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Supported Formats Info - Only show when not on upload page */}
        {location.pathname !== '/upload' && (
          <div className="mt-8 inline-block">
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
              <p className="text-indigo-200 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                <span className="font-medium">Supported formats:</span>
                <span className="ml-2 text-white">PDF, DOCX, TXT, PPT, PPTX</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;