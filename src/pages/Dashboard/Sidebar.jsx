import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  FileText,
  CalendarCheck,
  ClipboardList,
  Home,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  // Sidebar Menu Data
  const menuData = [
    {
      category: "General",
      items: [
        { name: "Home", path: "/", icon: <Home size={18} /> },
      ],
    },
    {
      category: "Users",
      items: [
        { name: "All Users", path: "/dashboard/admin-users", icon: <UserPlus size={18} /> },
        { name: "Online Admission", path: "/online-admission", icon: <Users size={18} /> },
      ],
    },
    {
      category: "Student",
      items: [
        { name: "List of Students", path: "/students", icon: <Users size={18} /> },
        { name: "Manage Student", path: "/manage-student", icon: <UserPlus size={18} /> },
        { name: "Reports", path: "/student-reports", icon: <FileText size={18} />, badge: 3 },
      ],
    },
    {
      category: "Attendance",
      items: [
        { name: "Student Attendance", path: "/student-attendance", icon: <CalendarCheck size={18} /> },
        { name: "Student Attn Reports", path: "/student-attn-reports", icon: <ClipboardList size={18} />, badge: 5 },
        { name: "Employee Attendance", path: "/employee-attendance", icon: <CalendarCheck size={18} /> },
        { name: "Employee Attn Reports", path: "/employee-attn-reports", icon: <ClipboardList size={18} /> },
        { name: "Attendance Devices", path: "/attendance-devices", icon: <ClipboardList size={18} /> },
      ],
    },
    {
      category: "Fees",
      items: [
        { name: "Fee Collection", path: "/fees", icon: <FileText size={18} /> },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Sidebar (overlay) */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 md:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute top-5 left-0 h-full w-72 bg-white shadow-lg p-4 transition-transform transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar content */}
          <SidebarContent setIsOpen={setIsOpen} menuData={menuData} />
        </div>
      </div>

      {/* Desktop Sidebar (always visible) */}
      <div className="hidden md:flex md:flex-col md:w-64 md:h-screen md:bg-white md:shadow-lg md:p-4">
        <SidebarContent setIsOpen={setIsOpen} menuData={menuData} />
      </div>
    </>
  );
};

// Reusable Sidebar content
const SidebarContent = ({ setIsOpen, menuData }) => (
  <div className="space-y-6 overflow-y-auto h-full pr-2">
    {menuData.map((section, idx) => (
      <div key={idx}>
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          {section.category}
        </h2>
        <ul className="space-y-1">
          {section.items.map((item, i) => (
            <li key={i}>
              <Link
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);


export default Sidebar;