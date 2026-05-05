import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
export default function EditGuardProfile({ guard, onClose, onUpdated }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    firstName: guard.firstName,
    lastName: guard.lastName,
    phone: guard.phone,
    email: guard.email || ""
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const save = () => {
    if (newPassword && newPassword !== confirmPassword) {
      setMessage(t("passwordsDoNotMatch"));
      return;
    }

    const token = localStorage.getItem("guardToken");

    axios
      .put(
        "http://localhost:5000/api/settings/guard",
        {
          ...form,
          ...(newPassword && { password: newPassword })
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        onUpdated(res.data.guard);
        setMessage(t("profileUpdated"));
      })
      .catch(() => setMessage(t("updateFailed")));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-10 w-full max-w-lg">
        <h3 className="text-2xl font-semibold mb-6">{t("editGuardProfile")}</h3>

        {["firstName", "lastName", "phone", "email"].map(field => (
          <input
            key={field}
            value={form[field]}
            onChange={e =>
              setForm({ ...form, [field]: e.target.value })
            }
            placeholder={t(field)}
            className="w-full border px-4 py-3 rounded mb-4"
          />
        ))}

        <input
          type="password"
          placeholder={t("newPassword")}
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="w-full border px-4 py-3 rounded mb-3"
        />

        <input
          type="password"
          placeholder={t("confirmPassword")}
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full border px-4 py-3 rounded mb-4"
        />

        {message && <p className="text-sm mb-4">{message}</p>}

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 border py-2 rounded">
            {t("cancel")}
          </button>
          <button
            onClick={save}
            className="flex-1 bg-[#7B4B2A] text-white py-2 rounded"
          >
            {t("saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}
