import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderNavbar from "../../components/HeaderNavbar3";
import Sidebar from "../../components/Sidebar2";
import Footer from "../../components/Footer";
import VerifyGuardPassword from "./VerifyGuardPassword";
import EditGuardProfile from "./EditGuardProfile";

export default function GuardSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [guard, setGuard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("guardToken");
console.log("🚀 Calling Guard Settings API");
console.log("TOKEN USED:", token);

    // 🔐 Hard stop if token missing
    if (!token) {
      setError("Authentication required. Please login again.");
      setLoading(false);
      return;
    }
    axios
      .get("http://localhost:5000/api/settings/guard", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setGuard(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Guard profile fetch error:", err);
        setError(
          err.response?.data?.message || "Failed to load guard profile"
        );
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF6E5] to-[#F6E8D4] text-[#5A3A22]">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="px-6 md:px-10 py-12 max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Guard Settings
          </h1>
          <p className="text-sm text-[#7A5A40] mt-1">
            Profile & security management
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Guard Profile</h2>

          {loading ? (
            <p className="text-sm text-gray-500">Loading profile...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : guard ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase text-[#7A5A40] mb-1">Name</p>
                <p className="font-medium text-lg">
                  {guard.firstName} {guard.lastName}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-[#7A5A40] mb-1">Guard ID</p>
                <p className="font-medium">{guard.guardId}</p>
              </div>

              <div>
                <p className="text-xs uppercase text-[#7A5A40] mb-1">Phone</p>
                <p className="font-medium">{guard.phone}</p>
              </div>

              <div>
                <p className="text-xs uppercase text-[#7A5A40] mb-1">Email</p>
                <p className="font-medium">{guard.email || "—"}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-600">No guard data found</p>
          )}
        </div>

        {/* SECURITY CARD */}
        <div className="bg-gradient-to-r from-[#7B4B2A] to-[#5A341C] text-[#FFF6E5] rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] p-10">
          <h2 className="text-2xl font-semibold mb-3">
            Edit Profile & Security
          </h2>
          <p className="text-sm max-w-xl">
            Verify your identity before making sensitive changes.
          </p>

          <button
            onClick={() => setShowVerify(true)}
            className="mt-8 bg-[#FFF1D6] text-[#5A3A22] px-10 py-3 rounded-full font-semibold hover:scale-105 hover:shadow-lg transition"
          >
            Authenticate & Continue →
          </button>
        </div>
      </main>

      <Footer />

      {/* VERIFY PASSWORD MODAL */}
      {showVerify && (
        <VerifyGuardPassword
          onClose={() => setShowVerify(false)}
          onSuccess={() => {
            setShowVerify(false);
            setAllowEdit(true);
          }}
        />
      )}

      {/* EDIT PROFILE MODAL */}
      {allowEdit && guard && (
        <EditGuardProfile
          guard={guard}
          onClose={() => setAllowEdit(false)}
          onUpdated={setGuard}
        />
      )}
    </div>
  );
}
