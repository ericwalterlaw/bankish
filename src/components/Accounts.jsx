import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';


const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [showBalances, setShowBalances] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('bankToken');
      const response = await fetch('https://bankishbackend.onrender.com/api/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const getAccountIcon = (type) => {
    switch (type) {
      case 'checking':
        return '🏦';
      case 'savings':
        return '💰';
      case 'credit':
        return '💳';
      default:
        return '🏦';
    }
  };

  const getAccountTypeDisplay = (type) => {
    switch (type) {
      case 'checking':
        return 'Checking Account';
      case 'savings':
        return 'Savings Account';
      case 'credit':
        return 'Credit Account';
      default:
        return 'Account';
    }
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Accounts</h2>
          <p className="text-gray-600">Manage your accounts and view balances</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showBalances ? 'Hide' : 'Show'} Balances</span>
          </button>
        </div>
      </div>

      {/* Accounts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div
            key={account._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 flex flex-col h-full">
              {/* Top */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getAccountIcon(account.accountType)}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getAccountTypeDisplay(account.accountType)}
                    </h3>
                    <p className="text-sm text-gray-600">••••{account.accountNumber.slice(-4)}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Balance */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                  {showBalances ? formatCurrency(account.balance) : '••••••'}
                </p>
              </div>

              {/* Status & Date */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    account.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                </span>
                <p className="text-sm text-gray-600">
                  Opened {new Date(account.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                  <Link to="/transfer">
                  <span className="text-sm font-medium">Transfer</span>
                  </Link>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="text-sm font-medium">Deposit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Open Savings Account', 'Apply for Credit Card', 'Open CD Account', 'Business Account'].map(
            (label, i) => (
              <button
                key={i}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
              >
                <Plus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">{label}</p>
              </button>
            )
          )}
        </div>
      </div>

      {/* Features & Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Features</h3>
          <ul className="space-y-3">
            {[
              'Free online banking and mobile app',
              'No minimum balance required',
              '24/7 customer support',
              'FDIC insured up to $250,000',
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-gray-700">{feature}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interest Rates</h3>
          <div className="space-y-3">
            {[
              { type: 'Checking Account', rate: '0.01% APY' },
              { type: 'Savings Account', rate: '0.50% APY' },
              { type: 'Money Market', rate: '1.25% APY' },
              { type: '12-Month CD', rate: '2.50% APY' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="text-gray-700">{item.type}</p>
                <p className="font-semibold text-gray-900">{item.rate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
