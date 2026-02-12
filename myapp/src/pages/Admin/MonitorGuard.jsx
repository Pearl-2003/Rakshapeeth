import React, { useEffect, useState } from "react";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";

export default function MonitorGuard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("live"); // live | history
  const [guards, setGuards] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ============================
     FETCH LIVE DUTY
  ============================ */
  const fetchLiveGuards = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Admin not logged in");

      const res = await fetch(
        "http://localhost:5000/api/admin/guard-duty/live",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load live data");

      setGuards(data.guards || []);
      setLoading(false);
    } catch (err) {
      console.error("Live duty error:", err);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Unable to load live guard duty",
        text: err.message,
      });
    }
  };

  /* ============================
     FETCH DUTY HISTORY
  ============================ */
  const fetchDutyHistory = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Admin not logged in");

      const res = await fetch(
        "http://localhost:5000/api/admin/guard-duty/history",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load history");

      setHistory(data.history || []);
      setLoading(false);
    } catch (err) {
      console.error("History error:", err);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Unable to load duty history",
        text: err.message,
      });
    }
  };

  /* ============================
     EFFECT: TAB BASED FETCHING
  ============================ */
  useEffect(() => {
    setLoading(true);

    if (activeTab === "live") {
      fetchLiveGuards();
      const interval = setInterval(fetchLiveGuards, 15000);
      return () => clearInterval(interval);
    } else {
      fetchDutyHistory();
    }
  }, [activeTab]);

  /* ============================
     DURATION FORMATTER
  ============================ */
  const formatDuration = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const tableData = activeTab === "live" ? guards : history;

  return (
    <div className="font-sans bg-gradient-to-b from-cream to-cream/90 min-h-screen text-brown">
      {/* Header */}
      <HeaderNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        adminName="Admin"
      />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-28 px-6 pb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          🛡️ Guard Duty Monitoring
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              activeTab === "live"
                ? "bg-brown text-white"
                : "bg-cream border text-brown"
            }`}
          >
            Live Duty
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              activeTab === "history"
                ? "bg-brown text-white"
                : "bg-cream border text-brown"
            }`}
          >
            Duty History
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 overflow-x-auto">
          {loading ? (
            <div className="text-center text-lg py-10 text-brown/70">
              Loading data...
            </div>
          ) : tableData.length === 0 ? (
            <div className="text-center text-lg py-10 text-brown/70">
              {activeTab === "live"
                ? "No guards are currently on duty."
                : "No duty history available."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-brown/30">
                  <th className="py-3 px-4">Guard ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Login Time</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {tableData.map((duty, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-cream/50 transition"
                  >
                    <td className="py-3 px-4 font-semibold">
                      {duty.guard.guardId}
                    </td>

                    <td className="py-3 px-4">
                      {duty.guard.firstName} {duty.guard.lastName}
                    </td>

                    <td className="py-3 px-4">{duty.guard.phone}</td>

                    <td className="py-3 px-4">
                      {new Date(duty.loginAt).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      {formatDuration(duty.duration)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full font-semibold text-sm ${
                          duty.logoutAt
                            ? duty.autoClosed
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {duty.logoutAt
                          ? duty.autoClosed
                            ? "AUTO CLOSED"
                            : "OFF DUTY"
                          : "ON DUTY"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
