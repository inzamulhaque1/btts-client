import { Menu, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Topbar = ({ setIsSidebarOpen }) => {
  return (
    <div className="w-full bg-[#002147] shadow-md py-3 sticky top-0 z-50">
      <div className="w-11/12 mx-auto flex items-center justify-between px-4">
        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <Menu className="w-7 h-7" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <Link to='/'><span className="hidden sm:inline">bTheTrustSeller</span></Link>
        </div>

        {/* Notification */}
        <button className="relative hover:text-gray-300 transition text-white">
          <Bell className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;