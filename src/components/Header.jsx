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
      <div className="flex items-center justify-between w-full px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">
              {getPageTitle()}
            </h1>
            <p className="hidden sm:block text-sm text-gray-500">
              Welcome back, {user?.firstName}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
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
              {/* Avatar OR initials */}
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </span>
                </div>
              )}

              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
