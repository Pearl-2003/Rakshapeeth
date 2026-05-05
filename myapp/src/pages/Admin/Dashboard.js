// src/pages/Admin/Dashboard.js
import React, { useState, useEffect,useRef } from "react";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import AdminActivityChart from "../../components/AdminActivityChart.jsx";


export default function AdminDashboard() {
const [sidebarOpen, setSidebarOpen] = useState(false);
const [adminName, setAdminName] = useState("");
const [logsOpen, setLogsOpen] = useState(false);
const logsRef = useRef(null);
const navigate = useNavigate();
const [dailyEntries, setDailyEntries] = useState(0);
const [pendingRequests, setPendingRequests] = useState(0);
const [activeTab, setActiveTab] = useState("requests");
const [requestNotifications, setRequestNotifications] = useState([]);
const [alertNotifications, setAlertNotifications] = useState([]);
const [todayEntries, setTodayEntries] = useState(0);
const [activityData, setActivityData] = useState([]);

const fetchTodayEntries = async () => {
  try {
    const res = await API.get("http://localhost:5000/api/dashboard/today-entries");

    console.log("Today entries API:", res.data);

    setTodayEntries(res.data.count); // ✅ FIXED
  } catch (error) {
    console.error("Failed to fetch today entries", error);
  }
};

useEffect(() => {
    fetchTodayEntries(); // initial load

  const interval = setInterval(() => {
    fetchTodayEntries();
  }, 5000); // refresh every 5 seconds

  return () => clearInterval(interval);
}, []);

  // ✅ Live Active Guards
  const [activeGuards, setActiveGuards] = useState(0);
  // ✅ Fetch Active Guards (auto refresh every 5s)
  useEffect(() => {
    const fetchActiveGuards = async () => {
  try {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      console.log("No admin token found");
      return;
    }


    const res = await fetch("http://localhost:5000/api/admin/guard-duty/live", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.log("Response not OK:", res.status);
      return;
    }

    const data = await res.json();

    console.log("Live guards response:", data);

    // If backend returns array directly
    if (Array.isArray(data)) {
      setActiveGuards(data.length);
    }
    // If backend returns { guards: [...] }
    else if (data.guards && Array.isArray(data.guards)) {
      setActiveGuards(data.guards.length);
    } else {
      setActiveGuards(0);
    }
  } catch (err) {
    console.error("Failed to fetch active guards", err);
  }
};


    fetchActiveGuards();
    const interval = setInterval(fetchActiveGuards, 5000);
    return () => clearInterval(interval);
  }, []);
useEffect(() => {
const token = localStorage.getItem("adminToken");

if (token) {
try {
const decoded = jwtDecode(token);
setAdminName(decoded.name || "Admin");
} catch {}
}
function handleClickOutside(event) {
    if (logsRef.current && !logsRef.current.contains(event.target)) {
      setLogsOpen(false);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
useEffect(() => {
  async function fetchDailyEntries() {
    try {
      const response = await fetch("http://localhost:4000/admin/daily-entries");
      const data = await response.json();

      console.log("API DATA:", data);   // 🔥 debug

      if (response.ok) {
        setDailyEntries(data.totalEntries);
      }
    } catch (err) {
      console.error("Server error:", err);
    }
  }

  fetchDailyEntries();
}, []);
useEffect(() => {
  async function fetchPendingRequests() {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        "http://localhost:5000/api/admin/requests/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Pending Requests API:", data); // 🔥 debug

      if (response.ok) {
        setPendingRequests(data.count);
      } else {
        console.error("Error:", data);
      }
    } catch (err) {
      console.error("Server error:", err);
    }
  }

  fetchPendingRequests();
}, []);
useEffect(() => {
  async function fetchNotifications() {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,

          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRequestNotifications(data.requestNotifications || []);
        setAlertNotifications(data.alertNotifications || []);
      } else {
        console.error("Notification fetch error:", data);
      }

    } catch (err) {
      console.error("Server error:", err);
    }
  }

  fetchNotifications();
}, []);
useEffect(() => {
  async function fetchActivity() {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard/activity",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setActivityData(data.data);
      }

    } catch (err) {
      console.error("Activity fetch error:", err);
    }
  }

  fetchActivity();
}, []);

  const stats = [
  { title: "Daily Entries", value: dailyEntries.toLocaleString() },
{ title: "Pending Requests", value: pendingRequests.toString() },
  { title: "Active Guards", value: activeGuards },
    { title: "Vehicles Today", value: todayEntries },
];

 const quickActions = [
  { name: "Handle Requests", icon: "✅", path: "/admin/requests" },
  { name: "Campus Activity", icon: "📊", path: "/admin/system-activity" },
  { name: "Create Gatepass", icon: "⏳", path: "/admin/create-gatepass" },
  { name: "Monitor Guards", icon: "🛡️", path: "/admin/monitor-guard" },
];


  const recentLogs = [
    { id: 1, person: "S. Sharma", type: "Student Exit", time: "10:24 AM" },
    { id: 2, person: "Delivery - DHL", type: "Vehicle Entry", time: "10:10 AM" },
    { id: 3, person: "A. Gupta", type: "Visitor Check-in", time: "09:58 AM" },
    { id: 4, person: "G. Singh", type: "Guard Login", time: "09:42 AM" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/90 font-sans text-brown">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} adminName={adminName} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* overlay when sidebar open */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30" onClick={() => setSidebarOpen(false)}></div>}

      <main className="relative z-20 px-6 md:px-12 lg:px-20 py-10">
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">Welcome to Admin Dashboard</h1>
              <p className="mt-2 text-sm text-brown/70">Overview of campus security operations & quick actions.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm text-brown/60">Today</span>
                <span className="font-semibold">{new Date().toLocaleDateString()}</span>
              </div>

              <div className="relative" ref={logsRef}>
  <button
    onClick={() => setLogsOpen(!logsOpen)}
    className="px-5 py-2 bg-[#7B4B2A] text-cream rounded-full shadow-lg 
               hover:scale-105 hover:shadow-xl transition-all duration-300 
               flex items-center gap-2"
  >
    Logs
    <span className={`transition-transform duration-300 ${logsOpen ? "rotate-180" : ""}`}>
      ▼
    </span>
  </button>

  {/* Dropdown */}
  {logsOpen && (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl 
                 border border-cream/40 overflow-hidden z-50"
    >
      <button
  onClick={() => navigate("/admin/view-student-log")}
  className="w-full text-left px-5 py-3 hover:bg-cream/50 
             transition flex items-center gap-2 text-brown"
>
  🎓 Student Logs
</button>


      <div className="h-px bg-cream/60 mx-3"></div>

      <button
  onClick={() => navigate("/admin/vehicle-logs")}
  className="w-full text-left px-5 py-3 hover:bg-cream/50 
             transition flex items-center gap-2 text-brown"
>
  🚗 Vehicle Logs
</button>

    </motion.div>
  )}
</div>

            </div>
          </div>
        </motion.header>

        {/* Stats + Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 grid grid-cols-2 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} className="bg-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-brown/60">{s.title}</div>
                    <div className="text-2xl font-bold mt-2">{s.value}</div>
                  </div>
                  <div className="text-sm text-brown/60">{s.delta}</div>
                </div>

                {/* floating decorative circle */}
                <div className="absolute -right-8 -top-8 w-36 h-36 bg-cream/30 rounded-full blur-2xl pointer-events-none"></div>
              </motion.div>
            ))}

            <motion.div whileHover={{ y: -6 }} className="bg-white rounded-2xl p-6 shadow-xl col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Campus Activity (Last 24h)</h3>
                <div className="text-sm text-brown/60">Live</div>
              </div>

              {/* Simple sparkline */}
              <div className="w-full h-72">
  <AdminActivityChart data={activityData} />
</div>


              {/* <div className="mt-4 text-sm text-brown/60">Smooth live overview of entries, exits and vehicle passes.</div> */}
            </motion.div>
          </div>

          <aside className="space-y-6">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl p-4 shadow-xl">
              <h4 className="font-semibold mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((q, idx) => (
                  <button
  key={idx}
  onClick={() => navigate(q.path)}
  className="flex items-center gap-2 p-3 bg-cream/60 rounded-xl hover:scale-105 transition transform"
>

                    <span>{q.icon}</span>
                    <span className="text-sm font-medium">{q.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl p-4 shadow-xl">
              <h4 className="font-semibold text-lg mb-4">Notifications</h4>

{/* Segmented Control */}
<div className="relative flex bg-cream/40 rounded-full p-1 mb-4">
  {/* Sliding Indicator */}
  <motion.div
    layout
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
    className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-[#7B4B2A] shadow-md`}
    style={{
      left: activeTab === "requests" ? "4px" : "50%",
      right: activeTab === "alerts" ? "4px" : "50%",
    }}
  />

  {/* Requests Tab */}
  <button
    onClick={() => setActiveTab("requests")}
    className={`relative z-10 flex-1 py-2 text-sm font-semibold transition ${
      activeTab === "requests"
        ? "text-cream"
        : "text-brown/70"
    }`}
  >
    Requests
    {requestNotifications.length > 0 && (
      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {requestNotifications.length}
      </span>
    )}
  </button>

  {/* Alerts Tab */}
  <button
    onClick={() => setActiveTab("alerts")}
    className={`relative z-10 flex-1 py-2 text-sm font-semibold transition ${
      activeTab === "alerts"
        ? "text-cream"
        : "text-brown/70"
    }`}
  >
    Alerts
    {alertNotifications.length > 0 && (
      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {alertNotifications.length}
      </span>
    )}
  </button>
</div>

{/* Notification List */}
<div className="space-y-3 max-h-56 overflow-y-auto pr-1">

  {/* REQUESTS */}
  {activeTab === "requests" && (
    requestNotifications.length === 0 ? (
      <div className="text-center text-brown/50 py-6">
        📭 No pending requests today
      </div>
    ) : (
      requestNotifications.map((n) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="p-3 rounded-xl bg-white/80 backdrop-blur-md shadow-md border border-cream/40 cursor-pointer transition"
        >
          <div className="text-sm font-medium text-brown">
            {n.message}
          </div>
          <div className="text-xs text-brown/50 mt-1">
            {new Date(n.time).toLocaleTimeString()}
          </div>
        </motion.div>
      ))
    )
  )}

  {/* ALERTS */}
  {activeTab === "alerts" && (
    alertNotifications.length === 0 ? (
      <div className="text-center text-brown/50 py-6">
        🚫 No alerts today
      </div>
    ) : (
      alertNotifications.map((n) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="p-3 rounded-xl bg-red-50 shadow-md border border-red-200 cursor-pointer transition"
        >
          <div className="text-sm font-medium text-red-700">
            {n.message}
          </div>
          <div className="text-xs text-red-500 mt-1">
            {new Date(n.time).toLocaleTimeString()}
          </div>
        </motion.div>
      ))
    )
  )}

</div>

            </motion.div>
          </aside>
        </section>


        {/* Floating Action Button */}
        <motion.button
  onClick={() => navigate("/admin/alerts")}
  whileHover={{ scale: 1.05 }}
  className="fixed right-10 bottom-10 bg-[#7B4B2A] text-cream rounded-full px-5 py-3 shadow-2xl z-50 hover:rotate-3 transition transform"
>
  🔔 New Alerts
</motion.button>

      </main>

      <Footer />
    </div>
  );
}