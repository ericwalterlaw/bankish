import React, { useState, useEffect } from 'react';
import { CreditCard, Eye, EyeOff, Lock, Unlock, Plus, MoreHorizontal } from 'lucide-react';

const Cards = ({ user }) => {
  const [cards, setCards] = useState([]);
  const [showCardNumbers, setShowCardNumbers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const token = localStorage.getItem('bankToken');
      const response = await fetch('http://localhost:3001/api/cards', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCardNumberVisibility = (cardId) =>
    setShowCardNumbers((prev) => ({ ...prev, [cardId]: !prev[cardId] }));

  const formatCardNumber = (cardNumber = '') => cardNumber.replace(/(.{4})/g, '$1 ').trim();

  const getCardColor = (cardType) => {
    switch (cardType) {
      case 'debit':
        return 'from-blue-600 to-blue-700';
      case 'credit':
        return 'from-purple-600 to-purple-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'blocked':
        return 'bg-red-100 text-red-700';
      case 'expired':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
          <h2 className="text-2xl font-bold text-gray-900">My Cards</h2>
          <p className="text-gray-600">Manage your debit and credit cards</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto">
          <Plus className="w-4 h-4" />
          <span>Request New Card</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card._id} className="space-y-4">
            {/* Card Visual */}
            <div
              className={`relative bg-gradient-to-br ${getCardColor(
                card.cardType
              )} rounded-2xl p-6 text-white shadow-lg`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="text-sm font-medium opacity-80">
                  {(card.cardType || '').toUpperCase()} CARD
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-6 bg-white rounded opacity-80"></div>
                  <div className="w-8 h-6 bg-white rounded opacity-60"></div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-lg font-mono tracking-wider">
                  {showCardNumbers[card._id]
                    ? formatCardNumber(card.cardNumber || '')
                    : '•••• •••• •••• ' + (card.cardNumber || '').slice(-4)}
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs opacity-60 mb-1">CARD HOLDER</div>
                  <div className="text-sm font-medium">
                    {(user?.firstName || '').toUpperCase()} {(user?.lastName || '').toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-60 mb-1">EXPIRES</div>
                  <div className="text-sm font-medium">{card.expiryDate}</div>
                </div>
              </div>
            </div>

            {/* Card Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(card.status)}`}>
                  {card.status?.charAt(0).toUpperCase() + card.status?.slice(1)}
                </span>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {card.cardType === 'credit' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Credit Limit</span>
                    <span className="font-medium text-gray-900">
                      ${card.creditLimit?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">35% used</div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => toggleCardNumberVisibility(card._id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {showCardNumbers[card._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="text-sm">{showCardNumbers[card._id] ? 'Hide' : 'Show'}</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                  {card.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  <span className="text-sm">{card.status === 'active' ? 'Block' : 'Unblock'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Card Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Services</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Set PIN</p>
                  <p className="text-sm text-gray-600">Change your card PIN</p>
                </div>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Card Limits</p>
                  <p className="text-sm text-gray-600">Modify spending limits</p>
                </div>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Plus className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Add Authorized User</p>
                  <p className="text-sm text-gray-600">Add family member to account</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Features</h3>
          <div className="space-y-4">
            {[
              { label: 'Contactless Payments', on: true, note: 'Tap to pay enabled' },
              { label: 'Online Purchases', on: true, note: 'E-commerce transactions' },
              { label: 'International Usage', on: false, note: 'Overseas transactions' },
              { label: 'ATM Withdrawals', on: true, note: 'Cash withdrawal access' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.note}</p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full relative ${
                    item.on ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 ${
                      item.on ? 'right-1' : 'left-1'
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
