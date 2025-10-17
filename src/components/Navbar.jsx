import React, { useState, useMemo, useCallback } from 'react';
import { Phone, Facebook, Twitter, Instagram, Linkedin, Menu, X, LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const location = useLocation();
    const { currentUser, logout } = useAuth();

    // Memoized menu items - My Order only shows when user is logged in
    const menuItems = useMemo(() => {
        const baseItems = [
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Services', path: '/services' },
            { name: 'Contact', path: '/contact' }
        ];
        
        // Add My Order only if user is logged in
        if (currentUser) {
            return [
                ...baseItems.slice(0, 3), // Home, About, Services
                { name: 'My Order', path: '/orders' }, // My Order after Services
                ...baseItems.slice(3) // Contact
            ];
        }
        
        return baseItems;
    }, [currentUser]);

    // Memoized logout handler
    const handleLogout = useCallback(async () => {
        try {
            await logout();
            setIsUserDropdownOpen(false);
        } catch (err) {
            console.error("Logout failed:", err.message);
        }
    }, [logout]);

    return (
        <div className="w-full font-sans">
            {/* Top Bar */}
            <div className="bg-slate-900 text-white py-2 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-sm">
                    {/* Contact Info */}
                    <div className="flex items-center gap-4">
                        <a 
                            href="https://wa.me/1234567890" 
                            className="flex items-center gap-2 hover:text-blue-200 transition-all duration-300 group"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            <span className="font-medium group-hover:scale-105 transition-transform">
                                +1 (234) 567-890
                            </span>
                        </a>
                    </div>
                    
                    {/* Social Icons */}
                    <div className="flex items-center gap-3">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                            <a 
                                key={index}
                                href="#" 
                                className="text-slate-300 hover:text-cyan-300 transition-all duration-300 hover:scale-110 p-1 rounded"
                                aria-label={Icon.name}
                            >
                                <Icon className="w-3.5 h-3.5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="sticky top-0 z-50 shadow-xl backdrop-blur-sm bg-opacity-95 bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link 
                                to="/" 
                                className="text-xl sm:text-2xl font-bold hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                            >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-teal-500">
                                    <span className="font-bold text-slate-900">
                                        B
                                    </span>
                                </div>
                                <span className="text-slate-100">
                                    TheTrustSeller
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Menu Items */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm relative group ${
                                            isActive 
                                                ? 'text-cyan-300 font-semibold' 
                                                : 'text-slate-300 hover:text-cyan-200'
                                        }`}
                                    >
                                        {item.name}
                                        {isActive && (
                                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 rounded-full bg-teal-500"></div>
                                        )}
                                        <div 
                                            className={`absolute inset-0 rounded-lg transition-opacity duration-300 -z-10 ${
                                                isActive ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'
                                            } bg-teal-500`}
                                        ></div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* User Section */}
                        <div className="flex items-center gap-3">
                            {currentUser ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 group bg-slate-900"
                                    >
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-teal-500 text-slate-900">
                                            {currentUser.displayName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <span className="hidden sm:block font-medium max-w-24 truncate text-slate-100">
                                            {currentUser.displayName || currentUser.email?.split('@')[0]}
                                        </span>
                                        <ChevronDown 
                                            className={`w-4 h-4 transition-transform duration-300 ${
                                                isUserDropdownOpen ? 'rotate-180' : ''
                                            } text-slate-100`}
                                        />
                                    </button>

                                    {/* User Dropdown */}
                                    {isUserDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl border backdrop-blur-sm py-1 z-50 bg-slate-900 border-teal-500/25">
                                            <div className="px-4 py-2 border-b border-teal-500/25">
                                                <p className="text-sm font-medium truncate text-slate-100">
                                                    {currentUser.displayName || 'User'}
                                                </p>
                                                <p className="text-xs truncate text-slate-400">
                                                    {currentUser.email}
                                                </p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 hover:bg-teal-500/20 text-slate-100"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 hover:bg-teal-500/20 text-slate-100"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                <User className="w-4 h-4" />
                                                My Orders
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors duration-200 hover:bg-teal-500/20 text-slate-100"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link 
                                    to="/login"
                                    className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg group bg-teal-500 text-slate-900"
                                >
                                    <LogIn className="w-4 h-4 transition-transform group-hover:scale-110" />
                                    <span className="font-semibold">Login</span>
                                </Link>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg transition-colors hover:bg-teal-500/20 text-slate-100"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div 
                    className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-slate-900 ${
                        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="border-t py-2 border-teal-500/25">
                        <div className="px-4 space-y-1">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`block py-3 px-4 rounded-lg transition-all duration-300 font-medium relative ${
                                            isActive
                                                ? 'text-cyan-300 bg-teal-500/20 font-semibold'
                                                : 'text-slate-300 hover:text-cyan-200 hover:bg-teal-500/10'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                        {isActive && (
                                            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 rounded-full bg-teal-500"></div>
                                        )}
                                    </Link>
                                );
                            })}
                            
                            {!currentUser && (
                                <Link 
                                    to="/login"
                                    className="flex items-center justify-center gap-2 w-full mt-3 py-3 rounded-lg font-medium transition-all duration-300 bg-teal-500 text-slate-900"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span className="font-semibold">Login</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Overlay for dropdown */}
            {isUserDropdownOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsUserDropdownOpen(false)}
                />
            )}
        </div>
    );
};

export default Navbar;