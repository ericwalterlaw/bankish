import React, { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  DollarSign,
  Zap,
  Home,
  Car,
  Phone,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { api } from "../api";
import { toast } from "react-toastify";




const BillPay = ({ user }) => {
  const [activeTab, setActiveTab] = useState("pay");
  const [loading, setLoading] = useState(false);
  const [codeStep, setCodeStep] = useState(false);
  const [withdrawalCode, setWithdrawalCode] = useState("");
  const [inputEnabled, setInputEnabled] = useState(false);
  const [success, setSuccess] = useState(false);

  const [payees, setPayees] = useState([
    {
      id: 1,
      name: "Electric Company",
      category: "Utilities",
      icon: Zap,
      nextDue: "2024-01-15",
      amount: 125.5,
    },
    {
      id: 2,
      name: "Mortgage Payment",
      category: "Housing",
      icon: Home,
      nextDue: "2024-01-01",
      amount: 1850.0,
    },
    {
      id: 3,
      name: "Car Insurance",
      category: "Transportation",
      icon: Car,
      nextDue: "2024-01-10",
      amount: 89.99,
    },
    {
      id: 4,
      name: "Mobile Phone",
      category: "Utilities",
      icon: Phone,
      nextDue: "2024-01-05",
      amount: 65.0,
    },
  ]);

  const [billData, setBillData] = useState({
    payeeId: "",
    amount: "",
    paymentDate: "",
    account: "",
    memo: "",
  });

  const [accounts, setAccounts] = useState([]);

  // ✅ Fetch accounts from backend
  useEffect(() => {
   const fetchAccounts = async () => {
  try {
    const data = await api.get("/accounts"); // ✅ token handled in api.js
    setAccounts(data);

    // ✅ default to first account if available
    if (data.length > 0) {
      setBillData((prev) => ({
        ...prev,
        account: data[0]._id,
      }));
    }
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
};
    fetchAccounts();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const handlePayBill = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate loading + sending code
    setTimeout(() => {
      setLoading(false);
      setCodeStep(true);
      setTimeout(() => setInputEnabled(true), 1000);
    }, 1500);
  };

  const handleVerifyCode = () => {
    if (withdrawalCode === "1234") {
      setSuccess(true);
      setCodeStep(false);
      setWithdrawalCode("");
      setInputEnabled(false);
      setBillData({
        payeeId: "",
        amount: "",
        paymentDate: "",
        account: accounts[0]?._id || "",
        memo: "",
      });
    } else {
      toast.error("Invalid withdrawal code");
    }
  };


  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bill Pay</h2>
          <p className="text-gray-600">Manage your bills and schedule payments</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {success ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <h3 className="text-lg font-semibold text-green-700">
              Payment Scheduled Successfully!
            </h3>
          </div>
        ) : codeStep ? (
          <div className="space-y-4">
            <p className="text-red-600 font-medium">
              Please Input Automated Withdrawal Code
            </p>
            <input
              type="number"
              value={withdrawalCode}
              onChange={(e) => setWithdrawalCode(e.target.value)}
              disabled={!inputEnabled}
              className={`w-full px-4 py-3 border rounded-lg ${
                inputEnabled
                  ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  : "bg-gray-100 text-gray-400"
              }`}
              placeholder="Enter code"
            />
            <button
              onClick={handleVerifyCode}
              disabled={!inputEnabled}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              Confirm Code
            </button>
          </div>
        ) : (
          <form onSubmit={handlePayBill} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Payee
              </label>
              <select
                value={billData.payeeId}
                onChange={(e) =>
                  setBillData({ ...billData, payeeId: e.target.value })
                }
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={billData.amount}
                  onChange={(e) =>
                    setBillData({ ...billData, amount: e.target.value })
                  }
                  placeholder="0.00"
                  step="0.01"
                  required
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Date
              </label>
              <input
                type="date"
                value={billData.paymentDate}
                onChange={(e) =>
                  setBillData({ ...billData, paymentDate: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pay From Account
              </label>
              <select
                value={billData.account}
                onChange={(e) =>
                  setBillData({ ...billData, account: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Account</option>
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.accountType} (••••{acc.accountNumber.slice(-4)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Memo (Optional)
              </label>
              <input
                type="text"
                value={billData.memo}
                onChange={(e) =>
                  setBillData({ ...billData, memo: e.target.value })
                }
                placeholder="Payment reference"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Schedule Payment"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BillPay;
