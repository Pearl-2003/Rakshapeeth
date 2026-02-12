import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import VerifyPassword from "./VerifyPassword";
import EditAdminProfile from "./EditAdminProfile";

export default function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVerify, setShowVerify] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/settings/admin", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setAdmin(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF6E5] to-[#F6E8D4] text-[#5A3A22]">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="px-6 md:px-10 py-12 max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Manage Accounts
          </h1>
          <p className="text-sm text-[#7A5A40] mt-2">
            Admin profile & security settings
          </p>
        </div>

        {/* ADMIN PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-10 mb-12 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFF1D6] rounded-full blur-2xl"></div>

          {/* Header row */}
          <div className="flex items-center gap-6 mb-10">
            <div className="w-14 h-14 rounded-full bg-[#7B4B2A] text-[#FFF6E5] flex items-center justify-center text-xl font-bold shadow-md">
              A
            </div>
            <div>
              <h2 className="text-xl font-semibold">Admin Profile</h2>
              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-[#FFF1D6] text-[#7B4B2A] font-medium">
                ✓ Verified Admin
              </span>
            </div>
          </div>

          {/* Profile data */}
          {loading ? (
            <p className="text-sm text-gray-500">Loading profile...</p>
          ) : admin ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { label: "Name", value: admin.name },
                { label: "Email", value: admin.email },
                { label: "Phone", value: admin.phone }
              ].map(item => (
                <div key={item.label}>
                  <div className="text-xs uppercase tracking-wide text-[#7A5A40] mb-2">
                    {item.label}
                  </div>
                  <div className="text-base font-semibold">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-red-600">Failed to load admin details</p>
          )}
        </div>

        {/* SECURITY CARD */}
        <div className="bg-gradient-to-r from-[#7B4B2A] to-[#5A341C] text-[#FFF6E5] rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>

          <h2 className="text-xl font-semibold mb-4">
            Edit Profile & Security
          </h2>

          <p className="text-sm text-[#FFEFD2] max-w-xl leading-relaxed">
            This section contains sensitive account information.  
            Please verify your identity before making any changes.
          </p>

          <button
            type="button"
            onClick={() => setShowVerify(true)}
            className="mt-10 bg-[#FFF1D6] text-[#5A3A22] px-12 py-3 rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-xl transition transform"
          >
            Authenticate & Continue →
          </button>
        </div>
      </main>

      <Footer />

      {showVerify && (
        <VerifyPassword
          onClose={() => setShowVerify(false)}
          onSuccess={() => {
            setShowVerify(false);
            setAllowEdit(true);
          }}
        />
      )}

      {allowEdit && admin && (
        <EditAdminProfile
          admin={admin}
          onClose={() => setAllowEdit(false)}
          onUpdated={setAdmin}
        />
      )}
    </div>
  );
}
