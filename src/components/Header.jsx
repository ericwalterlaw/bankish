import React, { useState } from "react";
import { Bell, Search, Menu } from "lucide-react";

const Header = ({ activeTab, sidebarOpen, setSidebarOpen, user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getPageTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      accounts: "My Accounts",
      transactions: "Transactions",
      transfer: "Transfer Money",
      billpay: "Pay Bills",
      cards: "My Cards",
      investments: "Investments",
      profile: "Profile Settings",
    };
    return titles[activeTab] || "Dashboard";
  };

  return (
    <header
      className={`top-0 left-0 right-0 z-30 h-16 flex items-center bg-white shadow-sm border-b border-gray-200 transition-all
        ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"} 
      `}
    >
      <div className="flex items-center justify-between w-full px-4 pb-6sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Sidebar toggle (mobile only) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">{getPageTitle()}</h1>
            <p className="hidden sm:block text-sm text-gray-500">
              Welcome back, {user?.firstName}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search (hidden on small screens) */}


          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
            </button>

            {/* Dropdown menu (optional) */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-40">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
