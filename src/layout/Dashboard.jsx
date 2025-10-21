import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../pages/Dashboard/Topbar";
import Sidebar from "../pages/Dashboard/Sidebar";


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Topbar */}
      <Topbar setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main content / Outlet */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;