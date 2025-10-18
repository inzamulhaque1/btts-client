import React, { useState, useMemo, useCallback, useEffect } from "react";
import axios from "axios";
import {
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  
  ShoppingCart,
  UserIcon,
  Workflow,
  WifiHigh,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  // Constants
  const SOCIAL_ICONS = [Facebook, Twitter, Instagram, Linkedin];

  // Dashboard submenu based on user role
  const getDashboardSubmenu = (role) => {
    const baseItems = [
      { name: "My Orders", path: "/my-orders", icon: ShoppingCart },
      { name: "Profile", path: "/profile", icon: UserIcon  },
    ];

    if (role === "admin") {
      return [
        { name: "Users", path: "/admin-users", icon: User },
        { name: "Add Service", path: "/add-services", icon: Workflow },
        { name: "All Service", path: "/admin-services", icon: WifiHigh },
        { name: "All Orders", path: "/admin-orders", icon: LayoutDashboard },
        ...baseItems,
      ];
    }

    return baseItems;
  };

  // Effects
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setIsDashboardDropdownOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsDashboardDropdownOpen(false);
    };
    
    if (isDashboardDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDashboardDropdownOpen]);

  useEffect(() => {
    if (currentUser?.uid) {
      axios
        .get(`https://btts-server-production.up.railway.app/users/${currentUser.uid}`)
        .then((response) => setUserRole(response.data.userRole))
        .catch((error) => {
          console.error("API error:", error);
          setUserRole(null);
        });
    } else {
      setUserRole(null);
    }
  }, [currentUser?.uid]);

  // Global menu items configuration
  const menuItems = useMemo(() => {
    const baseItems = [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Services", path: "/services" },
      { name: "Contact", path: "/contact" },
    ];

    if (!currentUser) return baseItems;

    const userItems = [...baseItems, 
        { name: "Dashboard", path: "/dashboard", hasSubmenu: true }];
    return userItems;
  }, [currentUser]);

  // Event handlers
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
      setIsDashboardDropdownOpen(false);
      setUserRole(null);
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  }, [logout]);

  const handleContactClick = () => {
    window.open("https://wa.me/8801732551463", "_blank", "noopener,noreferrer");
  };

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsDashboardDropdownOpen(false);
  }, []);

  const toggleDashboardDropdown = useCallback((e) => {
    e?.stopPropagation();
    setIsDashboardDropdownOpen(prev => !prev);
  }, []);

  // Helper Components
  const TopBar = () => (
    <div className="bg-slate-900 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
        <button
          onClick={handleContactClick}
          className="flex items-center gap-2 hover:text-blue-200 transition-all duration-300"
        >
          <Phone className="w-4 h-4" />
          <span className="font-medium">Contact Us</span>
        </button>

        <div className="flex items-center gap-3">
          {SOCIAL_ICONS.map((Icon, index) => (
            <a
              key={index}
              href="#"
              className="text-slate-300 hover:text-cyan-300 transition-all duration-300 hover:scale-110"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  const Logo = () => (
    <Link
      to="/"
      className="text-xl font-bold text-white"
    >
      
        <span className="font-bold text-cyan-500">b</span>TheTrustSeller
    </Link>
  );

  const MenuItem = ({ item, isMobile = false }) => {
    const isActive = location.pathname === item.path;

    if (item.hasSubmenu) {
      return isMobile ? (
        <MobileDashboardItem 
          item={item} 
          isActive={isActive} 
        />
      ) : (
        <DesktopDashboardItem 
          item={item} 
          isActive={isActive} 
        />
      );
    }

    const baseClasses = `font-medium transition-all duration-300 ${
      isActive
        ? "text-cyan-300 bg-teal-500/20"
        : "text-slate-300 hover:text-cyan-200 hover:bg-teal-500/10"
    }`;

    return isMobile ? (
      <Link
        to={item.path}
        className={`block py-3 px-4 rounded-lg ${baseClasses}`}
        onClick={closeMobileMenu}
      >
        {item.name}
      </Link>
    ) : (
      <Link
        to={item.path}
        className={`px-4 py-2 rounded-lg ${baseClasses}`}
      >
        {item.name}
      </Link>
    );
  };

  const DesktopDashboardItem = ({ item, isActive }) => {
    const dashboardSubmenu = getDashboardSubmenu(userRole);

    return (
      <div className="relative">
        <button
          onClick={toggleDashboardDropdown}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isActive
              ? "text-purple-300 bg-purple-500/20"
              : "text-slate-300 hover:text-purple-200 hover:bg-purple-500/10"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          {item.name}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isDashboardDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDashboardDropdownOpen && (
          <div className="absolute left-0 mt-1 w-56 rounded-lg shadow-xl bg-slate-900 border border-purple-500/25 py-1 z-50">
            {dashboardSubmenu.map((subItem) => (
              <Link
                key={subItem.path}
                to={subItem.path}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-purple-300 hover:bg-purple-500/20"
                onClick={() => setIsDashboardDropdownOpen(false)}
              >
                <subItem.icon className="w-4 h-4" />
                {subItem.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const MobileDashboardItem = ({ item, isActive }) => {
    const dashboardSubmenu = getDashboardSubmenu(userRole);

    return (
      <div className="space-y-1">
        <button
          onClick={toggleDashboardDropdown}
          className={`flex items-center justify-between w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
            isActive
              ? "text-purple-300 bg-purple-500/20"
              : "text-slate-300 hover:text-purple-200 hover:bg-purple-500/10"
          }`}
        >
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            {item.name}
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-transform ${
              isDashboardDropdownOpen ? "rotate-90" : ""
            }`}
          />
        </button>

        {isDashboardDropdownOpen && (
          <div className="pl-6 space-y-1">
            {dashboardSubmenu.map((subItem) => (
              <Link
                key={subItem.path}
                to={subItem.path}
                className={`flex items-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                  location.pathname === subItem.path
                    ? "text-purple-300 bg-purple-500/20"
                    : "text-slate-300 hover:text-purple-200 hover:bg-purple-500/10"
                }`}
                onClick={closeMobileMenu}
              >
                <subItem.icon className="w-4 h-4" />
                {subItem.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const DesktopMenu = () => (
    <div className="hidden lg:flex items-center space-x-2">
      {menuItems.map((item) => (
        <MenuItem key={item.path} item={item} />
      ))}
    </div>
  );

  const MobileMenu = () => (
    <div
      className={`lg:hidden bg-slate-900 transition-all duration-300 ${
        isMobileMenuOpen
          ? "max-h-96 opacity-100"
          : "max-h-0 opacity-0 overflow-hidden"
      }`}
    >
      <div className="px-4 py-2 space-y-1">
        {menuItems.map((item) => (
          <MenuItem key={item.path} item={item} isMobile={true} />
        ))}

        {currentUser ? (
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 w-full rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300 font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      ) : (
        <Link
          to="/login"
          className="flex items-center gap-2 px-4 py-2 w-full rounded-lg bg-teal-500 text-slate-900 hover:bg-teal-600 transition-all duration-300 font-semibold"
        >
          <LogIn className="w-4 h-4" />
          Login
        </Link>
      )}
      </div>
    </div>
  );

  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="lg:hidden p-2 rounded-lg text-white hover:bg-teal-500/20 transition-all duration-300"
    >
      {isMobileMenuOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <Menu className="w-6 h-6" />
      )}
    </button>
  );

  const DesktopAuthButtons = () => (
    <div className="hidden lg:flex items-center gap-3">
      {currentUser ? (
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300 font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      ) : (
        <Link
          to="/login"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 text-slate-900 hover:bg-teal-600 transition-all duration-300 font-semibold"
        >
          <LogIn className="w-4 h-4" />
          Login
        </Link>
      )}
    </div>
  );

  return (
    <div className="w-full font-sans">
      <TopBar />
      
      <nav
        className={`sticky top-0 z-50 bg-slate-800 shadow-xl transition-all ${
          isScrolled ? "bg-slate-800/95 backdrop-blur-sm" : "bg-slate-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            
            <DesktopMenu />
            
            <div className="flex items-center gap-3">
              <DesktopAuthButtons />
              <MobileMenuButton />
            </div>
          </div>
        </div>

        <MobileMenu />
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  );
};

export default Navbar;