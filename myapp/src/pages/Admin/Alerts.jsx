import React, { useState, useEffect } from "react";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminAlertsCenter() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("IRIS"); // 🔥 NEW

  const IRIS_API = "http://localhost:5000/api/security-alerts";
  const VEHICLE_API = "http://localhost:5000/api/vehicle-alerts";

  /* ================= FETCH ALERTS ================= */

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const api =
        activeTab === "IRIS" ? IRIS_API : VEHICLE_API;

      const res = await axios.get(api);
      setAlerts(res.data);
    } catch {
      Swal.fire("Error", "Failed to load alerts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [activeTab]);

  /* ================= LEVEL ================= */

  const getLevel = (alert) => {
    if (alert.severity === "HIGH") return "CRITICAL";
    if (alert.severity === "MEDIUM") return "WARNING";
    return "INFO";
  };

  /* ================= VIEW DETAILS ================= */

  const viewDetails = (alert) => {
    if (activeTab === "IRIS") {
      Swal.fire({
        title: "Iris Alert Details",
        html: `
          <p><b>Student ID:</b> ${alert.studentId}</p>
          <p><b>Type:</b> ${alert.alertType}</p>
          <p><b>Reason:</b> ${alert.reason}</p>
          <p><b>Guard ID:</b> ${alert.raisedBy.guardId}</p>
          <p><b>Time:</b> ${new Date(alert.createdAt).toLocaleString()}</p>
          <img src="http://localhost:5000${alert.evidenceImageUrl}"
               style="width:100%;border-radius:12px;margin-top:12px"/>
        `,
        width: 600
      });
    } else {
      Swal.fire({
        title: "Vehicle Alert Details",
        html: `
          <p><b>Vehicle No:</b> ${alert.vehicleNo}</p>
          <p><b>Type:</b> ${alert.alertType}</p>
          <p><b>Reason:</b> ${alert.reason}</p>
          <p><b>Guard ID:</b> ${alert.raisedBy?.guardId}</p>
          <p><b>Time:</b> ${new Date(alert.createdAt).toLocaleString()}</p>
        `,
        width: 500
      });
    }
  };

  /* ================= ADMIN ACTION ================= */

  const takeAction = async (id, decision) => {
    const { value: note } = await Swal.fire({
      title: `Confirm ${decision}`,
      input: "textarea",
      inputPlaceholder: "Optional admin note",
      showCancelButton: true
    });

    if (note === undefined) return;

    const api =
      activeTab === "IRIS"
        ? `${IRIS_API}/${id}/action`
        : `${VEHICLE_API}/${id}/action`;

    try {
      await axios.post(api, {
        decision,
        reason: note || "",
        adminId: localStorage.getItem("adminId"),
        adminName: localStorage.getItem("adminName")
      });

      Swal.fire("Updated", "Alert updated successfully", "success");
      fetchAlerts();
    } catch {
      Swal.fire("Error", "Failed to update alert", "error");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/90 text-brown">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="px-6 md:px-12 lg:px-20 py-10">

        {/* HEADER */}
        <h1 className="text-4xl font-extrabold mb-6">
          🚨 Security Alerts Center
        </h1>

        {/* TABS */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => setActiveTab("IRIS")}
            className={`px-6 py-3 rounded-full font-bold ${
              activeTab === "IRIS"
                ? "bg-[#7B4B2A] text-white"
                : "bg-white shadow"
            }`}
          >
            👁 Iris Alerts
          </button>

          <button
            onClick={() => setActiveTab("VEHICLE")}
            className={`px-6 py-3 rounded-full font-bold ${
              activeTab === "VEHICLE"
                ? "bg-[#7B4B2A] text-white"
                : "bg-white shadow"
            }`}
          >
            🚗 Vehicle Alerts
          </button>
        </div>

        {/* ALERT LIST */}
        <section className="space-y-6">
          <AnimatePresence>
            {!loading &&
              alerts.map((alert) => {
                const level = getLevel(alert);
                return (
                  <motion.div
                    key={alert._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-6 rounded-2xl shadow-xl border-l-8 ${
                      level === "CRITICAL"
                        ? "border-red-600 bg-red-50"
                        : level === "WARNING"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {activeTab === "IRIS"
                            ? "Iris Security Alert"
                            : "Vehicle Security Alert"}
                        </h3>

                        <p className="text-sm mt-1 opacity-80">
                          {alert.reason}
                        </p>

                        <div className="text-xs mt-2 opacity-60">
                          {new Date(alert.createdAt).toLocaleString()}
                        </div>
                      </div>

                      
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-5 flex gap-3 flex-wrap">
                      <button
                        onClick={() => viewDetails(alert)}
                        className="px-4 py-2 bg-[#7B4B2A] text-white rounded-lg"
                      >
                        View Details
                      </button>

                      {alert.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => takeAction(alert._id, "APPROVED")}
                            className="px-4 py-2 bg-green-700 text-white rounded-lg"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => takeAction(alert._id, "REJECTED")}
                            className="px-4 py-2 bg-red-700 text-white rounded-lg"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => takeAction(alert._id, "HOLD")}
                            className="px-4 py-2 bg-black text-white rounded-lg"
                          >
                            Hold
                          </button>
                        </>
                      )}

                      {alert.status !== "PENDING" && (
                        <span className="font-bold">
                          Status: {alert.status}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>

          {!loading && alerts.length === 0 && (
            <p className="text-center opacity-70">
              No alerts available
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
