import React, { useState } from 'react';
import { Plus, Calendar, DollarSign, Zap, Home, Car, Phone, Trash2 } from 'lucide-react';

const BillPay = ({ user }) => {
  const [activeTab, setActiveTab] = useState('pay');
  const [payees, setPayees] = useState([
    { id: 1, name: 'Electric Company', category: 'Utilities', icon: Zap, nextDue: '2024-01-15', amount: 125.5 },
    { id: 2, name: 'Mortgage Payment', category: 'Housing', icon: Home, nextDue: '2024-01-01', amount: 1850.0 },
    { id: 3, name: 'Car Insurance', category: 'Transportation', icon: Car, nextDue: '2024-01-10', amount: 89.99 },
    { id: 4, name: 'Mobile Phone', category: 'Utilities', icon: Phone, nextDue: '2024-01-05', amount: 65.0 },
  ]);

  const [billData, setBillData] = useState({
    payeeId: '',
    amount: '',
    paymentDate: '',
    account: '',
    memo: '',
  });

  const [showAddPayee, setShowAddPayee] = useState(false);
  const [newPayee, setNewPayee] = useState({
    name: '',
    category: 'Utilities',
    accountNumber: '',
    address: '',
  });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const handlePayBill = (e) => {
    e.preventDefault();
    alert('Bill payment scheduled successfully!');
    setBillData({ payeeId: '', amount: '', paymentDate: '', account: '', memo: '' });
  };

  const getIconForCategory = (category) => {
    switch (category) {
      case 'Utilities':
        return Zap;
      case 'Housing':
        return Home;
      case 'Transportation':
        return Car;
      default:
        return DollarSign;
    }
  };

  const handleAddPayee = (e) => {
    e.preventDefault();
    const newId = Math.max(0, ...payees.map((p) => p.id)) + 1;
    setPayees([
      ...payees,
      {
        id: newId,
        name: newPayee.name,
        category: newPayee.category,
        icon: getIconForCategory(newPayee.category),
        nextDue: '',
        amount: 0,
      },
    ]);
    setNewPayee({ name: '', category: 'Utilities', accountNumber: '', address: '' });
    setShowAddPayee(false);
  };

  const removePayee = (id) => setPayees(payees.filter((p) => p.id !== id));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bill Pay</h2>
          <p className="text-gray-600">Manage your bills and schedule payments</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto">
          <Plus className="w-4 h-4" />
          <span>Add Payee</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto no-scrollbar px-4 sm:px-6 gap-6">
            <button
              onClick={() => setActiveTab('pay')}
              className={`py-4 border-b-2 font-medium text-sm shrink-0 ${
                activeTab === 'pay'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pay Bills
            </button>
            <button
              onClick={() => setActiveTab('payees')}
              className={`py-4 border-b-2 font-medium text-sm shrink-0 ${
                activeTab === 'payees'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Manage Payees
            </button>
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'pay' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Form */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Payment</h3>
                <form onSubmit={handlePayBill} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Payee</label>
                    <select
                      value={billData.payeeId}
                      onChange={(e) => setBillData({ ...billData, payeeId: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose a payee</option>
                      {payees.map((payee) => (
                        <option key={payee.id} value={payee.id}>
                          {payee.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={billData.amount}
                        onChange={(e) => setBillData({ ...billData, amount: e.target.value })}
                        placeholder="0.00"
                        step="0.01"
                        required
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
                    <input
                      type="date"
                      value={billData.paymentDate}
                      onChange={(e) => setBillData({ ...billData, paymentDate: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pay From Account</label>
                    <select
                      value={billData.account}
                      onChange={(e) => setBillData({ ...billData, account: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Account</option>
                      <option value="checking">Checking Account (••••1234)</option>
                      <option value="savings">Savings Account (••••5678)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Memo (Optional)</label>
                    <input
                      type="text"
                      value={billData.memo}
                      onChange={(e) => setBillData({ ...billData, memo: e.target.value })}
                      placeholder="Payment reference"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Schedule Payment
                  </button>
                </form>
              </div>

              {/* Upcoming Bills */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bills</h3>
                <div className="space-y-3">
                  {payees.map((payee) => {
                    const Icon = payee.icon;
                    return (
                      <div
                        key={payee.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 bg-white rounded-lg shrink-0">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{payee.name}</p>
                            <p className="text-sm text-gray-600">{payee.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(payee.amount)}
                          </p>
                          {payee.nextDue && (
                            <p className="text-sm text-gray-600">
                              Due {new Date(payee.nextDue).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Payee Management */
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Saved Payees</h3>
                <button
                  onClick={() => setShowAddPayee(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Payee</span>
                </button>
              </div>

              {showAddPayee && (
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Add New Payee</h4>
                  <form onSubmit={handleAddPayee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payee Name</label>
                      <input
                        type="text"
                        value={newPayee.name}
                        onChange={(e) => setNewPayee({ ...newPayee, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={newPayee.category}
                        onChange={(e) => setNewPayee({ ...newPayee, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Utilities">Utilities</option>
                        <option value="Housing">Housing</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={newPayee.accountNumber}
                        onChange={(e) =>
                          setNewPayee({ ...newPayee, accountNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Payee
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddPayee(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {payees.map((payee) => {
                  const Icon = payee.icon;
                  return (
                    <div key={payee.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{payee.name}</p>
                            <p className="text-sm text-gray-600">{payee.category}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removePayee(payee.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Pay Now
                        </button>
                        <button className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          Set up AutoPay
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillPay;
