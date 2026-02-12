import React, { useState } from "react";
import axios from "axios";

export default function VerifyPassword({ onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = () => {
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError("");

    const token = localStorage.getItem("adminToken");

    axios
      .post(
        "http://localhost:5000/api/settings/admin/verify-password",
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        if (res.data.valid) {
          onSuccess();
        } else {
          setError("Incorrect password");
        }
      })
      .catch(() => setError("Verification failed"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
      <div className="bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.25)] w-full max-w-md p-10 relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7A5A40] hover:text-[#5A3A22] text-xl"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-[#7B4B2A] text-[#FFF6E5] flex items-center justify-center text-2xl mx-auto shadow-md">
          🔒
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-center mt-6">
          Verify Your Identity
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-[#7A5A40] text-center mt-2 leading-relaxed">
          For security reasons, please confirm your password to continue.
        </p>

        {/* Input */}
        <div className="mt-8">
          <label className="block text-xs uppercase tracking-wide text-[#7A5A40] mb-2">
            Current Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#E6D3B8] focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]/40 transition"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 mt-3 text-center">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-4 mt-10">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-[#D8C2A5] text-[#5A3A22] font-medium hover:bg-[#FFF6E5] transition"
          >
            Cancel
          </button>

          <button
            onClick={verify}
            disabled={loading}
            className={`flex-1 py-3 rounded-full font-semibold text-[#5A3A22] transition ${
              loading
                ? "bg-[#E8DCCB] cursor-not-allowed"
                : "bg-[#FFF1D6] hover:scale-105 hover:shadow-lg"
            }`}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
