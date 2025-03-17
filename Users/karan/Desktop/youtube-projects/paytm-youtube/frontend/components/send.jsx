import axios from "axios";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

export function SendMoney() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const id = searchParams.get("id");
  const [amount, setAmount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Send Money</h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
              {name[0].toUpperCase()}
            </div>
            <span className="text-lg">{name}</span>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount (in Rs)
            </label>
            <input
              type="number"
              id="amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter amount"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </div>

          <button
            onClick={() => {
              axios.post(
                "http://localhost:3000/api/v1/account/transfer",
                {
                  to: id,
                  amount: amount,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
            }}
            className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Initiate Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
