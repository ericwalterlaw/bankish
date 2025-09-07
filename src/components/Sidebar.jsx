import React from "react";
import {
  Home,
  CreditCard,
  Repeat,
  FileText,
  Wallet,
  BarChart2,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Phone,
  FileUser
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NAME = import.meta.env.VITE_NAME;


const Sidebar = ({ sidebarOpen, setSidebarOpen, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { path: "/accounts", label: "Accounts", icon: <FileUser className="w-5 h-5" /> },
    { path: "/transactions", label: "Transactions", icon: <Repeat className="w-5 h-5" /> },
    { path: "/transfer", label: "Transfer", icon: <FileText className="w-5 h-5" /> },
    { path: "/billpay", label: "Bill Pay", icon: <Wallet className="w-5 h-5" /> },
    { path: "/cards", label: "Cards", icon: <CreditCard className="w-5 h-5" /> },
    // { path: "/investments", label: "Investments", icon: <BarChart2 className="w-5 h-5" /> },
    { path: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    // { path: "/help", label: "Customer Service", icon: <Phone className="w-5 h-5" /> },
  ];


  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white shadow-md z-40 flex flex-col
        transform transition-all duration-300
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
        lg:translate-x-0 ${sidebarOpen ? "lg:w-64" : "lg:w-16"}`}
      >
        {/* Logo + Collapse Button */}
        <div className="flex items-center justify-between h-16 border-b px-4">
          <span
            className={`text-xl font-bold text-blue-600 transition-all duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0 lg:hidden"
            }`}
          >
            {NAME}
          </span>
          <button
            className="hidden lg:flex items-center justify-center p-1 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)} // close sidebar on mobile
              className={`flex items-center w-full px-4 py-2 text-sm font-medium transition-colors
              ${
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span
                className={`ml-3 transition-all duration-300 ${
                  sidebarOpen ? "opacity-100" : "opacity-0 lg:hidden"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            <LogOut className="w-5 h-5" />
            <span
              className={`ml-3 transition-all duration-300 ${
                sidebarOpen ? "opacity-100" : "opacity-0 lg:hidden"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
