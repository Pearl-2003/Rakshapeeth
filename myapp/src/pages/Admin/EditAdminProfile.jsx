import React, { useState } from "react";
import axios from "axios";

export default function EditAdminProfile({ admin, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: admin.name,
    email: admin.email,
    phone: admin.phone
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const save = () => {
    setMessage("");

    // 🔐 Password validation (frontend)
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setMessage("Passwords do not match");
        return;
      }
      if (newPassword.length < 6) {
        setMessage("Password must be at least 6 characters long");
        return;
      }
    }

    setSaving(true);
    const token = localStorage.getItem("adminToken");

    axios
      .put(
        "http://localhost:5000/api/settings/admin",
        {
          ...form,
          ...(newPassword && { password: newPassword }) // backend-ready
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        onUpdated(res.data.admin);
        setMessage("Profile updated successfully");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch(() => setMessage("Update failed"))
      .finally(() => setSaving(false));
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
      <div className="bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.25)] w-full max-w-lg p-10 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#7A5A40] hover:text-[#5A3A22] text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-[#7B4B2A] text-[#FFF6E5] flex items-center justify-center text-xl shadow-md">
            ✏️
          </div>
          <div>
            <h3 className="text-2xl font-semibold">Edit Admin Profile</h3>
            <p className="text-sm text-[#7A5A40]">
              Update your account information
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-[#7A5A40] mb-2">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E6D3B8] focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]/40 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-[#7A5A40] mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E6D3B8] focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]/40 transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-[#7A5A40] mb-2">
              Phone
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E6D3B8] focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]/40 transition"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-[#F0E0C8] pt-6">
            <p className="text-sm font-medium text-[#5A3A22] mb-4">
              Change Password (Optional)
            </p>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-wide text-[#7A5A40] mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 rounded-xl border border-[#E6D3B8] focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]/40 transition"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#7A5A40] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-3 rounded-xl border border-[#E6D3B8] focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]/40 transition"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-sm mt-6 text-center ${
              message.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
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
            onClick={save}
            disabled={saving}
            className={`flex-1 py-3 rounded-full font-semibold text-[#5A3A22] transition ${
              saving
                ? "bg-[#E8DCCB] cursor-not-allowed"
                : "bg-[#FFF1D6] hover:scale-105 hover:shadow-lg"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
