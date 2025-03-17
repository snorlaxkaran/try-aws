import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUsers(res.data.users);
      });
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Bar */}
      <div className="bg-white px-6 py-4 shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">PayTM App</h1>
            <div className="text-sm text-gray-600">
              Your balance: <span className="font-medium">₹10,000</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Hello</span>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              U
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Users</h2>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {/* Sample User */}
            {users.map((user) => (
              <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-medium">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-gray-800 font-medium">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    navigate(`/send?id=${user.id}&name=${user.name}`);
                  }}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Send Money
                </button>
              </div>
            ))}

            {/* More sample users */}
          </div>
        </div>
      </div>
    </div>
  );
}
