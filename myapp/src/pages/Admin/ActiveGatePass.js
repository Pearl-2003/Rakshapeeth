import React, { useEffect, useState } from "react";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";

export default function ActiveGatePasses() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gatepasses, setGatepasses] = useState([]);

  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  const fetchGatepasses = async () => {
  try {
    let query = [];
    if (search) query.push(`search=${search}`);
    if (date) query.push(`date=${date}`);

    const qs = query.length ? `?${query.join("&")}` : "";

    const res = await fetch(
      `http://localhost:5000/api/admin/active-gatepasses${qs}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    // 🔐 Always normalize to array
    if (Array.isArray(data)) {
      setGatepasses(data);
    } else if (Array.isArray(data.gatepasses)) {
      setGatepasses(data.gatepasses);
    } else {
      setGatepasses([]);
    }
  } catch (err) {
    console.error("Gatepass fetch error:", err);
  }
};


  useEffect(() => {
    fetchGatepasses();
  }, [search, date]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/90 font-sans text-brown">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="relative z-20 px-6 md:px-12 lg:px-20 py-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Active Gatepasses
          </h1>
          <p className="mt-2 text-sm text-brown/70">
            Showing only valid gatepasses. Expired or used passes are hidden automatically.
          </p>
        </motion.header>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-xl mb-10 flex flex-col md:flex-row gap-4"
        >
          <input
            type="text"
            placeholder="Search by Student ID or Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-full border border-brown/40 focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-6 py-3 rounded-full border border-brown/40 bg-cream focus:outline-none"
          />
        </motion.div>

        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div whileHover={{ y: -6 }} className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-brown/60">Active Gatepasses</div>
            <div className="text-3xl font-bold mt-2">{gatepasses.length}</div>
          </motion.div>

          <motion.div whileHover={{ y: -6 }} className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-brown/60">Expiring Today</div>
            <div className="text-3xl font-bold mt-2">
              {gatepasses.filter(
                (g) =>
                  g.expectedExitDate ===
                  new Date().toISOString().split("T")[0]
              ).length}
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -6 }} className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-brown/60">Live Status</div>
            <div className="mt-2 text-green-700 font-semibold">System Normal</div>
          </motion.div>
        </section>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-x-auto"
        >
          <table className="w-full">
            <thead className="bg-brown/20">
              <tr>
                <th className="p-4 text-left">Student ID</th>
                <th className="p-4 text-left">Student Name</th>
                <th className="p-4 text-left">Exit Date</th>
                <th className="p-4 text-left">Exit Time</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {gatepasses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-brown/60">
                    No active gatepasses found
                  </td>
                </tr>
              ) : (
                gatepasses.map((g) => (
                  <tr
                    key={g._id}
                    className="border-b hover:bg-cream/60 transition"
                  >
                    <td className="p-4 font-semibold">{g.studentId}</td>
                    <td className="p-4">{g.studentName || "—"}</td>
                    <td className="p-4">{g.expectedExitDate}</td>
                    <td className="p-4">{g.expectedExitTime}</td>
                    <td className="p-4 text-center">
                      <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
