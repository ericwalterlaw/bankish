import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Dashboard from "./Dashboard";

const Layout = ({ user }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-white shadow-md transition-all duration-300`}
      >
        <div className="p-4 flex justify-between items-center">
          <span className="font-bold text-blue-600">
            {isOpen ? "MyBank" : "MB"}
          </span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <nav className="px-4 space-y-2">
          <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">
            Dashboard
          </a>
          <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">
            Accounts
          </a>
          <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">
            Transactions
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <Dashboard user={user} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
