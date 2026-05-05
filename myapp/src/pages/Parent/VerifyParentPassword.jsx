import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
export default function VerifyParentPassword({ onClose, onSuccess }) {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("parentToken");

  const verify = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/settings/parent/verify-password",
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data.valid) onSuccess();
      else setError(t("verificationFailed"));
    } catch (err) {
      console.error(err);
      setError(t("verificationFailed"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-center">
          <h3>{t("verifyPassword")}</h3>
        </h3>

        <input
          type="password"
          placeholder={t("enterCurrentPassword")}
          className="w-full px-4 py-3 border rounded-xl mb-4"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-600 text-center mb-2">
            {error}
          </p>
        )}

        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 border rounded-full"
          >
            {t("cancel")}
          </button>
          <button
            onClick={verify}
            className="flex-1 py-3 rounded-full bg-[#7B4B2A] text-white font-semibold"
          >
            {t("verify")}
          </button>
        </div>
      </div>
    </div>
  );
}
