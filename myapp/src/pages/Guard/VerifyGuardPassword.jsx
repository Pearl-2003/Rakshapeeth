import React, { useState } from "react";
import axios from "axios";

export default function VerifyGuardPassword({ onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const verify = () => {
    const token = localStorage.getItem("guardToken");

    axios
      .post(
        "http://localhost:5000/api/settings/guard/verify-password",
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        if (res.data.valid) onSuccess();
        else setError("Incorrect password");
      })
      .catch(() => setError("Verification failed"));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Verify Password
        </h3>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-4 py-3 rounded mb-3"
        />

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 border py-2 rounded">
            Cancel
          </button>
          <button
            onClick={verify}
            className="flex-1 bg-[#7B4B2A] text-white py-2 rounded"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
