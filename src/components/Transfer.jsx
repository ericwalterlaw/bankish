import React, { useState, useEffect } from "react";
import {
  Send,
  Users,
  Building2,
  Globe,
  Check,
  Lock,
} from "lucide-react";
import { api } from "../api";


const Transfer = ({ user }) => {
  const [accounts, setAccounts] = useState([]);
  const [awcCode, setAwcCode] = useState(""); // fetched from backend
  const [enteredAwc, setEnteredAwc] = useState(""); // user input in modal
  const [showAwcModal, setShowAwcModal] = useState(false);

  const [loading, setLoading] = useState(false); // transfer submit
  const [processing, setProcessing] = useState(false); // pre-modal delay
  const [success, setSuccess] = useState(false);

  const [awcError, setAwcError] = useState(""); // inline error

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
    fetchAwcCode();
  }, []);

  // Fetch user accounts

const fetchAccounts = async () => {
  try {
    const data = await api.get("/accounts"); // clean GET
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


  // Fetch user's AWC code
const fetchAwcCode = async () => {
  try {
    const data = await api.get("/auth/me"); // GET via api wrapper
    setAwcCode(data.awcCode); // assumes backend sends { awcCode: "1234" }
  } catch (error) {
    console.error("Error fetching AWC code:", error);
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

  // Handle transfer form submit → show processing, then AWC modal
  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowAwcModal(true);
    }, 2000); // 2s delay before modal
  };


const confirmTransfer = async () => {
  if (enteredAwc !== awcCode) {
    setAwcError("Invalid AWC code. Please try again.");
    return;
  }

  setAwcError("");
  setLoading(true);

  const payload = {
    transferType: transferData.transferType,
    ...transferData.common,
    ...(transferData[transferData.transferType]),
  };

  if (transferData.transferType === "swift") {
    payload.toAccount = transferData.swift.beneficiaryIban;
  }
  if (transferData.transferType === "sepa") {
    payload.toAccount = transferData.sepa.beneficiaryIban;
  }
  if (transferData.transferType === "crypto") {
    payload.toAccount = transferData.crypto.toAddress;
  }

  try {
    const data = await api.post("/transactions/transfer", payload);

    setSuccess(true);
    await fetchAccounts();
    setTimeout(() => setSuccess(false), 5000);
  } catch (error) {
    setAwcError(error.message || "Transfer failed.");
  } finally {
    setLoading(false);
    setShowAwcModal(false);
    setEnteredAwc("");
  }
};

  // Success screen
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

      {/* Processing overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">
              Processing transfer...
            </p>
          </div>
        </div>
      )}

      {/* AWC Modal */}
      {showAwcModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Enter AWC Code
              </h2>
            </div>
            <p className="text-sm text-red-500 mb-4">
              If you don’t have your AWC, please contact your account manager
              or the support team.
            </p>
            <input
              type="password"
              value={enteredAwc}
              onChange={(e) => setEnteredAwc(e.target.value)}
              placeholder="Enter your AWC code"
              className="w-full px-4 py-3 border rounded-lg mb-2"
            />
            {awcError && (
              <p className="text-red-500 text-sm mb-2">{awcError}</p>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAwcModal(false);
                  setEnteredAwc("");
                  setAwcError("");
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmTransfer}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Confirming..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Your transfer form goes here (same as before) */}
      {/* ... keep your existing form code here ... */}
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
                <>
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
                  <input
                    type="number"
                    placeholder="Amount"
                    value={transferData.common.amount}
                    onChange={(e) =>
                      handleChange("common", "amount", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg mt-4"
                  />
                </>
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
                      handleChange("swift", "beneficiaryAddress", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={transferData.common.amount}
                    onChange={(e) =>
                      handleChange("common", "amount", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg mt-4"
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
                  <input
                    type="number"
                    placeholder="Amount"
                    value={transferData.common.amount}
                    onChange={(e) =>
                      handleChange("common", "amount", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg mt-4"
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

    {/* Auto Network Display */}
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Network
      </label>
      <div className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-800">
        {transferData.crypto.currency === "BTC" && "BTC"}
        {transferData.crypto.currency === "ETH" && "ERC20"}
        {transferData.crypto.currency === "USDT" && "TRC20"}
      </div>
    </div>

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
     
    </div>
  );
};

export default Transfer;
