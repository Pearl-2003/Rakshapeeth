import React, { useState } from "react";
import axios from "axios";

export default function EditParentProfile({ parent, onClose, onUpdated }) {
  const [form, setForm] = useState({
    firstName: parent.firstName,
    lastName: parent.lastName,
    email: parent.email,
    phone: parent.phone,
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("parentToken");

  const save = async () => {
    setError("");

    if (form.password && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone
    };

    if (form.password) payload.password = form.password;

    try {
      setSaving(true);

      const res = await axios.put(
        "http://localhost:5000/api/settings/parent",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      onUpdated(res.data.parent);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-10 w-full max-w-lg shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-xl"
        >
          ✕
        </button>

        <h3 className="text-2xl font-semibold mb-6">
          Edit Parent Profile
        </h3>

        <div className="space-y-4">
          {["firstName", "lastName", "email", "phone"].map(field => (
            <input
              key={field}
              value={form[field]}
              onChange={e =>
                setForm({ ...form, [field]: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-xl"
              placeholder={field}
            />
          ))}

          <input
            type="password"
            placeholder="New Password (optional)"
            className="w-full px-4 py-3 border rounded-xl"
            value={form.password}
            onChange={e =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-4 py-3 border rounded-xl"
            value={form.confirmPassword}
            onChange={e =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 mt-4 text-center">
            {error}
          </p>
        )}

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 border rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 py-3 rounded-full bg-[#7B4B2A] text-white font-semibold"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
