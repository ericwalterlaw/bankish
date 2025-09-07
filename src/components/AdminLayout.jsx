import React, { useState } from "react";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={onLogout}
      />

      {/* Main content */}
      <main
        className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300
        ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
