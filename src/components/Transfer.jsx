import React, { useState, useEffect } from "react";
import { Send, Users, Building2, ArrowRight, Check, Globe } from "lucide-react";

const Transfer = ({ user }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [transferData, setTransferData] = useState({
    transferType: "internal",
    internal: { fromAccountId: "", toAccount: "" },
    swift: {
      fromAccountId: "",
      beneficiaryName: "",
      beneficiaryIban: "",
      swiftCode: "",
      beneficiaryAddress: "",
    },
    sepa: {
      fromAccountId: "",
      beneficiaryName: "",
      beneficiaryIban: "",
      reference: "",
    },
    crypto: {
      fromAccountId: "",
      currency: "BTC",
      toAddress: "",
      amount: "",
      networkFee: "",
    },
    common: { amount: "", description: "" },
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("bankToken");
      const response = await fetch(
        "https://bankishbackend.onrender.com/api/accounts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setAccounts(data);

      if (data.length > 0) {
        setTransferData((prev) => ({
          ...prev,
          internal: { ...prev.internal, fromAccountId: data[0]._id },
          swift: { ...prev.swift, fromAccountId: data[0]._id },
          sepa: { ...prev.sepa, fromAccountId: data[0]._id },
          crypto: { ...prev.crypto, fromAccountId: data[0]._id },
        }));
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleChange = (section, field, value) => {
    setTransferData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // Mock fee fetching for crypto
  useEffect(() => {
    if (
      transferData.transferType === "crypto" &&
      transferData.crypto.amount
    ) {
      const fetchFee = async () => {
        try {
          // For now just fake a random fee
          const fee = (Math.random() * 0.0005).toFixed(6);
          setTransferData((prev) => ({
            ...prev,
            crypto: {
              ...prev.crypto,
              networkFee: `${fee} ${prev.crypto.currency}`,
            },
          }));
        } catch (err) {
          console.error("Fee fetch failed", err);
        }
      };
      fetchFee();
    }
  }, [
    transferData.transferType,
    transferData.crypto.amount,
    transferData.crypto.currency,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      transferType: transferData.transferType,
      ...transferData.common,
      ...(transferData[transferData.transferType]),
    };

    try {
      const token = localStorage.getItem("bankToken");
      const response = await fetch(
        "https://bankishbackend.onrender.com/api/transactions/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        await fetchAccounts();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSelectedAccount = () => {
    return accounts.find(
      (account) => account._id === transferData.internal.fromAccountId
    );
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Transfer Successful!
          </h2>
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Transfer Money</h2>
        <p className="text-gray-600">
          Send money between your accounts or to others
        </p>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: "internal", label: "My Accounts", icon: Users },
                    { key: "swift", label: "SWIFT", icon: Building2 },
                    { key: "sepa", label: "SEPA", icon: Globe },
                    { key: "crypto", label: "Crypto", icon: Globe },
                  ].map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() =>
                        setTransferData((prev) => ({
                          ...prev,
                          transferType: t.key,
                        }))
                      }
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        transferData.transferType === t.key
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <t.icon className="w-5 h-5 text-blue-600" />
                        <p className="font-medium text-gray-900">{t.label}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal */}
              {transferData.transferType === "internal" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Account
                  </label>
                  <select
                    value={transferData.internal.toAccount}
                    onChange={(e) =>
                      handleChange("internal", "toAccount", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  >
                    <option value="">Select Account</option>
                    {accounts
                      .filter(
                        (a) => a._id !== transferData.internal.fromAccountId
                      )
                      .map((a) => (
                        <option key={a._id} value={a.accountNumber}>
                          {a.accountType} (••••{a.accountNumber.slice(-4)})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* SWIFT */}
              {transferData.transferType === "swift" && (
                <>
                  <input
                    placeholder="Beneficiary Name"
                    value={transferData.swift.beneficiaryName}
                    onChange={(e) =>
                      handleChange("swift", "beneficiaryName", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                  <input
                    placeholder="Beneficiary IBAN/Account"
                    value={transferData.swift.beneficiaryIban}
                    onChange={(e) =>
                      handleChange("swift", "beneficiaryIban", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                  <input
                    placeholder="SWIFT/BIC Code"
                    value={transferData.swift.swiftCode}
                    onChange={(e) =>
                      handleChange("swift", "swiftCode", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                  <input
                    placeholder="Beneficiary Address"
                    value={transferData.swift.beneficiaryAddress}
                    onChange={(e) =>
                      handleChange(
                        "swift",
                        "beneficiaryAddress",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </>
              )}

              {/* SEPA */}
              {transferData.transferType === "sepa" && (
                <>
                  <input
                    placeholder="Beneficiary Name"
                    value={transferData.sepa.beneficiaryName}
                    onChange={(e) =>
                      handleChange("sepa", "beneficiaryName", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                  <input
                    placeholder="Beneficiary IBAN"
                    value={transferData.sepa.beneficiaryIban}
                    onChange={(e) =>
                      handleChange("sepa", "beneficiaryIban", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                  <input
                    placeholder="Payment Reference"
                    value={transferData.sepa.reference}
                    onChange={(e) =>
                      handleChange("sepa", "reference", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </>
              )}

              {/* CRYPTO */}
              {transferData.transferType === "crypto" && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={transferData.crypto.currency}
                    onChange={(e) =>
                      handleChange("crypto", "currency", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT)</option>
                  </select>
                  <input
                    placeholder="Recipient Wallet Address"
                    value={transferData.crypto.toAddress}
                    onChange={(e) =>
                      handleChange("crypto", "toAddress", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg mt-4"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={transferData.crypto.amount}
                    onChange={(e) =>
                      handleChange("crypto", "amount", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg mt-4"
                  />
                  {transferData.crypto.amount && (
                    <p className="text-sm text-gray-600 mt-2">
                      Estimated Network Fee:{" "}
                      {transferData.crypto.networkFee || "Fetching..."}
                    </p>
                  )}
                </>
              )}

              {/* Common */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={transferData.common.description}
                  onChange={(e) =>
                    handleChange("common", "description", e.target.value)
                  }
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="What's this for?"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Transfer Summary
            </h3>
            <div className="space-y-4 text-sm">
              <p>
                <span className="font-medium">Type:</span>{" "}
                {transferData.transferType.toUpperCase()}
              </p>
              {transferData.transferType === "crypto" ? (
                <>
                  <p>
                    <span className="font-medium">Currency:</span>{" "}
                    {transferData.crypto.currency}
                  </p>
                  <p>
                    <span className="font-medium">To:</span>{" "}
                    {transferData.crypto.toAddress || "Not set"}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span>{" "}
                    {transferData.crypto.amount || "0"}{" "}
                    {transferData.crypto.currency}
                  </p>
                  <p>
                    <span className="font-medium">Fee:</span>{" "}
                    {transferData.crypto.networkFee || "Calculating..."}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <span className="font-medium">Amount:</span>{" "}
                    {transferData.common.amount || "0"}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {transferData.common.description || "-"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
