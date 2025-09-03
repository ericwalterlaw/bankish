import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Accounts from "./components/Accounts";
import Transactions from "./components/Transactions";
import Transfer from "./components/Transfer";
import BillPay from "./components/BillPay";
import Cards from "./components/Cards";
import Investments from "./components/Investments";
import Profile from "./components/Profile";
import Login from "./components/Login";
import GetHelp from "./components/GetHelp";


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("bankToken");
    if (token) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("bankToken");
      const response = await fetch("https://bankishbackend.onrender.com/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem("bankToken");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("bankToken");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData.user);
    localStorage.setItem("bankToken", userData.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("bankToken");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />

        {/* Main Area */}
        <div className="flex-1 flex flex-col">
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
            onLogout={handleLogout}
          />

          {/* Content */}
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/accounts" element={<Accounts user={user} />} />
              <Route path="/transactions" element={<Transactions user={user} />} />
              <Route path="/transfer" element={<Transfer user={user} />} />
              <Route path="/billpay" element={<BillPay user={user} />} />
              <Route path="/cards" element={<Cards user={user} />} />
              <Route path="/investments" element={<Investments user={user} />} />
              <Route path="/help" element={<GetHelp user={user} />} />
              <Route path="/profile" element={<Profile user={user} onUpdate={fetchUserData} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
