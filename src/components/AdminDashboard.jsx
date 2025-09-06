import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newBalance, setNewBalance] = useState("");
  const [transactionData, setTransactionData] = useState({
    userId: "",
    accountId: "",
    type: "deposit",
    amount: "",
    description: "",
  });

  const token = localStorage.getItem("bankToken");

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users with accounts
  const fetchUsers = async () => {
    try {
      const res = await fetch("https://bankishbackend.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update account balance
  const handleUpdateBalance = async () => {
    if (!selectedAccount) return;
    try {
      const res = await fetch(
        `https://bankishbackend.onrender.com/api/admin/accounts/${selectedAccount}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ balance: Number(newBalance) }),
        }
      );
      await res.json();
      alert("Balance updated!");
      setNewBalance("");
      setSelectedAccount(null);
      fetchUsers(); // refresh
    } catch (err) {
      console.error("Error updating balance:", err);
    }
  };

  // Add manual transaction
  const handleAddTransaction = async () => {
    try {
      const res = await fetch("https://bankishbackend.onrender.com/api/admin/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });
      await res.json();
      alert("Transaction added!");
      setTransactionData({
        userId: "",
        accountId: "",
        type: "deposit",
        amount: "",
        description: "",
      });
      fetchUsers();
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  if (loading) return <p className="p-6">Loading users...</p>;

  // ✅ Extract selected user
  const selectedUser = users.find((u) => u._id === transactionData.userId);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* User List */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Users</h2>
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="border-b pb-4">
                <h3 className="font-bold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>

                {/* Accounts */}
                <div className="mt-2 space-y-2">
                  {user.accounts?.map((acc) => (
                    <div
                      key={acc._id}
                      className="flex justify-between items-center bg-gray-50 p-2 rounded"
                    >
                      <span>
                        {acc.accountType} – Balance:{" "}
                        <span className="font-semibold">${acc.balance}</span>
                      </span>
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        onClick={() => setSelectedAccount(acc._id)}
                      >
                        Edit Balance
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Balance Editor */}
      {selectedAccount && (
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Update Account Balance</h2>
          <input
            type="number"
            className="border rounded px-3 py-2 mr-2"
            placeholder="Enter new balance"
            value={newBalance}
            onChange={(e) => setNewBalance(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={handleUpdateBalance}
          >
            Save
          </button>
        </div>
      )}

      {/* Add Transaction */}
      <div className="bg-white shadow p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Add Transaction</h2>
        <div className="space-y-2">
          {/* Select User */}
          <select
            className="border rounded px-3 py-2 w-full"
            value={transactionData.userId}
            onChange={(e) =>
              setTransactionData({
                ...transactionData,
                userId: e.target.value,
                accountId: "", // reset account when user changes
              })
            }
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName} ({user.email})
              </option>
            ))}
          </select>

       {/* Select Account */}
{selectedUser && selectedUser.accounts && selectedUser.accounts.length > 0 ? (
  <select
    className="border rounded px-3 py-2 w-full"
    value={transactionData.accountId}
    onChange={(e) =>
      setTransactionData({
        ...transactionData,
        accountId: e.target.value,
      })
    }
  >
    <option value="">Select Account</option>
    {selectedUser.accounts.map((acc) => (
      <option key={acc._id} value={acc._id}>
        {acc.accountType} – Balance: ${acc.balance}
      </option>
    ))}
  </select>
) : (
  <p className="text-sm text-gray-500">This user has no accounts</p>
)}


          {/* Transaction Type */}
          <select
            className="border rounded px-3 py-2 w-full"
            value={transactionData.type}
            onChange={(e) =>
              setTransactionData({ ...transactionData, type: e.target.value })
            }
          >
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
            <option value="payment">Payment</option>
          </select>

          {/* Amount */}
          <input
            type="number"
            placeholder="Amount"
            className="border rounded px-3 py-2 w-full"
            value={transactionData.amount}
            onChange={(e) =>
              setTransactionData({ ...transactionData, amount: e.target.value })
            }
          />

          {/* Description */}
          <input
            type="text"
            placeholder="Description"
            className="border rounded px-3 py-2 w-full"
            value={transactionData.description}
            onChange={(e) =>
              setTransactionData({
                ...transactionData,
                description: e.target.value,
              })
            }
          />

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleAddTransaction}
          >
            Add Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
