import React, { useState, useEffect } from 'react';
import { Send, Users, Building2, ArrowRight, Check } from 'lucide-react';

const Transfer = ({ user }) => {
  const [accounts, setAccounts] = useState([]);
  const [transferData, setTransferData] = useState({
    fromAccountId: '',
    toAccount: '',
    amount: '',
    description: '',
    transferType: 'internal'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('bankToken');
      const response = await fetch('https://bankishbackend.onrender.com/api/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAccounts(data);
      if (data.length > 0) {
        setTransferData(prev => ({ ...prev, fromAccountId: data[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('bankToken');
      const response = await fetch('https://bankishbackend.onrender.com/api/transactions/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transferData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);

        // Reset form
        setTransferData({
          fromAccountId: accounts[0]?._id || '',
          toAccount: '',
          amount: '',
          description: '',
          transferType: 'internal'
        });

        // 🔑 Re-fetch accounts so balances are up-to-date
        await fetchAccounts();

        // Hide success after a delay
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    setTransferData({
      ...transferData,
      [e.target.name]: e.target.value
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getSelectedAccount = () => {
    return accounts.find(account => account._id === transferData.fromAccountId);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your transfer of has been completed successfully.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Make Another Transfer
          </button>
        </div>
      </div>
    );
  }

  return (
       <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Transfer Money</h2>
        <p className="text-gray-600">Send money between your accounts or to others</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transfer Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Transfer Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTransferData(prev => ({ ...prev, transferType: 'internal' }))}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      transferData.transferType === 'internal'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Between My Accounts</p>
                        <p className="text-sm text-gray-600">Transfer between your own accounts</p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferData(prev => ({ ...prev, transferType: 'external' }))}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      transferData.transferType === 'external'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">To Another Bank</p>
                        <p className="text-sm text-gray-600">Send to external accounts</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* From Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Account
                </label>
                <select
                  name="fromAccountId"
                  value={transferData.fromAccountId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Account</option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account
                      (••••{account.accountNumber.slice(-4)}) - {formatCurrency(account.balance)}
                    </option>
                  ))}
                </select>
              </div>

              {/* To Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {transferData.transferType === 'internal' ? 'To Account' : 'Recipient Account Number'}
                </label>
                {transferData.transferType === 'internal' ? (
                  <select
                    name="toAccount"
                    value={transferData.toAccount}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Account</option>
                    {accounts
                      .filter(account => account._id !== transferData.fromAccountId)
                      .map((account) => (
                        <option key={account._id} value={account.accountNumber}>
                          {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account
                          (••••{account.accountNumber.slice(-4)})
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="toAccount"
                    value={transferData.toAccount}
                    onChange={handleChange}
                    placeholder="Enter recipient account number"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="amount"
                    value={transferData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    required
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {getSelectedAccount() && (
                  <p className="text-sm text-gray-600 mt-1">
                    Available: {formatCurrency(getSelectedAccount().balance)}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  name="description"
                  value={transferData.description}
                  onChange={handleChange}
                  placeholder="What's this transfer for?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Transfer</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Transfer Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">From</span>
                <span className="font-medium text-gray-900">
                  {getSelectedAccount() ? 
                    `${getSelectedAccount().accountType} (••••${getSelectedAccount().accountNumber.slice(-4)})` :
                    'Select account'
                  }
                </span>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">To</span>
                <span className="font-medium text-gray-900">
                  {transferData.toAccount || 'Select recipient'}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="text-xl font-bold text-gray-900">
                    {transferData.amount ? formatCurrency(parseFloat(transferData.amount)) : '$0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 mb-2">Transfer Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Transfers are usually instant</li>
              <li>• No fees for internal transfers</li>
              <li>• External transfers may take 1-3 business days</li>
              <li>• Daily transfer limit: $10,000</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;