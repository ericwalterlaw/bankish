import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  PoundSterling,
  Euro
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);

  // Currency State
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState({ USD: 1, GBP: 0.79, EUR: 0.92 });

  useEffect(() => {
    fetchDashboardData();
    fetchAccounts();
    fetchRates();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('bankToken');
      const response = await fetch('https://bankishbackend.onrender.com/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('bankToken');
      const response = await fetch('https://bankishbackend.onrender.com/api/accounts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchRates = async () => {
    try {
      const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=USD,GBP,EUR");
      const data = await res.json();
      if (data && data.rates) {
        setRates(data.rates);
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0";

    const converted = amount * (rates[currency] || 1);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(converted);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case 'withdrawal':
      case 'transfer':
      case 'payment':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Balance',
        data: [12000, 15000, 13000, 17000, 16000, dashboardData?.totalBalance || 18000],
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const spendingData = {
    labels: ['Food & Dining', 'Shopping', 'Transportation', 'Bills', 'Entertainment'],
    datasets: [
      {
        data: [1200, 800, 400, 1500, 300],
        backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'],
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Good morning, {user?.firstName}!</h2>
        <p className="text-blue-100">Here's your financial overview for today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Currency Switcher */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h1 className="font-bold text-xl mb-4">Currency</h1>
          <div className="flex items-center mb-4 space-x-4">
            <button onClick={() => setCurrency("USD")} className={`p-3 rounded-lg ${currency === "USD" ? "bg-green-100" : ""}`}>
              <DollarSign className="w-6 h-6 text-green-600" />
            </button>
            <button onClick={() => setCurrency("GBP")} className={`p-3 rounded-lg ${currency === "GBP" ? "bg-blue-100" : ""}`}>
              <PoundSterling className="w-6 h-6 text-blue-600" />
            </button>
            <button onClick={() => setCurrency("EUR")} className={`p-3 rounded-lg ${currency === "EUR" ? "bg-purple-100" : ""}`}>
              <Euro className="w-6 h-6 text-purple-600" />
            </button>
            <button onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? (
                <Eye className="w-5 h-5 text-gray-400" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Balance</p>
          <p className="text-2xl font-bold text-gray-900">
            {showBalance ? formatCurrency(dashboardData?.totalBalance || 0) : '••••••'}
          </p>
        </div>

        {/* Accounts, Spending, etc */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="p-3 bg-blue-100 rounded-lg mb-4 w-fit">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Accounts</p>
          <p className="text-2xl font-bold text-gray-900">{dashboardData?.accountCount || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="p-3 bg-orange-100 rounded-lg mb-4 w-fit">
            <TrendingDown className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">This Month's Spending</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(dashboardData?.monthlySpending || 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="p-3 bg-purple-100 rounded-lg mb-4 w-fit">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Savings Goal</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(5000)}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Overview</h3>
          <div className="h-64">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>

        {/* Spending Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Breakdown</h3>
          <div className="h-64">
            <Doughnut
              data={spendingData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Accounts & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">My Accounts</h3>
          </div>
          <div className="p-6 space-y-4">
            {accounts.map((account) => (
              <div
                key={account._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 capitalize">
                    {account.accountType} Account
                  </p>
                  <p className="text-sm text-gray-600">••••{(account.accountNumber || '').slice(-4)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(account.balance)}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      account.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {account.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData?.recentTransactions?.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {getTransactionIcon(transaction.type)}
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {transaction.description || transaction.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'deposit' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                </div>
              ))}
              {!dashboardData?.recentTransactions?.length && (
                <p className="text-sm text-gray-500">No recent transactions.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
