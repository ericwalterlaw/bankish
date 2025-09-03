import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Plus } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';

const Investments = ({ user }) => {
  const [activeTab, setActiveTab] = useState('portfolio');
  
  const portfolioData = [
    { id: 1, name: 'Apple Inc.', symbol: 'AAPL', shares: 50, currentPrice: 175.43, change: 2.15, changePercent: 1.24 },
    { id: 2, name: 'Microsoft Corp.', symbol: 'MSFT', shares: 30, currentPrice: 338.52, change: -1.83, changePercent: -0.54 },
    { id: 3, name: 'Tesla Inc.', symbol: 'TSLA', shares: 25, currentPrice: 248.87, change: 12.45, changePercent: 5.26 },
    { id: 4, name: 'Amazon.com Inc.', symbol: 'AMZN', shares: 15, currentPrice: 127.74, change: 0.98, changePercent: 0.77 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const portfolioValue = portfolioData.reduce((total, stock) => total + (stock.shares * stock.currentPrice), 0);
  const totalChange = portfolioData.reduce((total, stock) => total + (stock.shares * stock.change), 0);
  const totalChangePercent = (totalChange / (portfolioValue - totalChange)) * 100;

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [28000, 32000, 29000, 35000, 38000, portfolioValue],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const allocationData = {
    labels: ['Technology', 'Healthcare', 'Finance', 'Consumer', 'Energy'],
    datasets: [
      {
        data: [45, 20, 15, 12, 8],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
      },
    ],
  };

  

  return (
       <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Investment Portfolio</h2>
          <p className="text-gray-600">Track and manage your investments</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Buy Securities</span>
        </button>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="p-3 bg-green-100 rounded-lg mb-4 w-fit">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Portfolio Value</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(portfolioValue)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className={`p-3 ${totalChange >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-lg mb-4 w-fit`}>
            {totalChange >= 0 ? (
              <TrendingUp className="w-6 h-6 text-green-600" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-600" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">Today's Change</p>
          <p className={`text-2xl font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalChange >= 0 ? '+' : ''}{formatCurrency(totalChange)}
          </p>
          <p className={`text-sm ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalChange >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="p-3 bg-blue-100 rounded-lg mb-4 w-fit">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Holdings</p>
          <p className="text-2xl font-bold text-gray-900">{portfolioData.length}</p>
          <p className="text-sm text-gray-600">Securities</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'portfolio'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'research'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Research
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'portfolio' ? (
            <div className="space-y-6">
              {/* Holdings Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Symbol</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Company</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Shares</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Price</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Change</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Market Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {portfolioData.map((stock) => (
                      <tr key={stock.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <span className="font-medium text-gray-900">{stock.symbol}</span>
                        </td>
                        <td className="px-4 py-4 text-gray-700">{stock.name}</td>
                        <td className="px-4 py-4 text-gray-700">{stock.shares}</td>
                        <td className="px-4 py-4 text-gray-700">{formatCurrency(stock.currentPrice)}</td>
                        <td className="px-4 py-4">
                          <span className={`font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
                          </span>
                          <span className={`text-sm ml-2 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold text-gray-900">
                          {formatCurrency(stock.shares * stock.currentPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'performance' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
                <div className="h-64">
                  <Line 
                    data={chartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        y: { beginAtZero: false }
                      }
                    }} 
                  />
                </div>
              </div>

              {/* Asset Allocation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
                <div className="h-64">
                  <Doughnut 
                    data={allocationData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'right' }
                      }
                    }} 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Market Research</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Market Trends</h4>
                  <p className="text-sm text-gray-600">Analyze current market conditions and trends</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Stock Screener</h4>
                  <p className="text-sm text-gray-600">Find stocks that match your criteria</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Company Reports</h4>
                  <p className="text-sm text-gray-600">Access detailed financial reports</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Investments;