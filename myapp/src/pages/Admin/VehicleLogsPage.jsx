import React, { useState, useEffect } from "react";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import API from "../../services/api";
import Swal from "sweetalert2";

export default function VehicleLogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logs, setLogs] = useState([]);

  // Filters
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [scanSource, setScanSource] = useState("");
  const [guardId, setGuardId] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchLogs = async () => {
    try {
      let params = [];

      if (status) params.push(`status=${status}`);
      if (source) params.push(`source=${source}`);
      if (scanSource) params.push(`scanSource=${scanSource}`);
      if (guardId) params.push(`guardId=${encodeURIComponent(guardId)}`);
      if (vehicleNo) params.push(`vehicleNo=${encodeURIComponent(vehicleNo)}`);
      if (fromDate) params.push(`fromDate=${fromDate}`);
      if (toDate) params.push(`toDate=${toDate}`);

      const query = params.length ? `?${params.join("&")}` : "";
      const res = await API.get(`/vehicle-logs${query}`);

      setLogs(res.data.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch vehicle logs", "error");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [status, source, scanSource, guardId, vehicleNo, fromDate, toDate]);

  const statusBadge = (status) =>
    status === "inside"
      ? "bg-green-100 text-green-700"
      : "bg-gray-200 text-gray-700";

  const sourceBadge = (src) => {
    const map = {
      WHITELIST: "bg-blue-100 text-blue-700",
      OCCASIONAL: "bg-purple-100 text-purple-700",
      MANUAL: "bg-orange-100 text-orange-700"
    };
    return map[src] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/90 text-brown">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="px-6 md:px-12 lg:px-20 py-10">
        <h1 className="text-3xl font-bold mb-6">Vehicle Logs</h1>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="border p-2 rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="inside">Inside</option>
            <option value="outside">Outside</option>
          </select>

          <select className="border p-2 rounded" value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">All Sources</option>
            <option value="WHITELIST">Whitelist</option>
            <option value="OCCASIONAL">Occasional</option>
            <option value="MANUAL">Manual</option>
          </select>

          <select className="border p-2 rounded" value={scanSource} onChange={(e) => setScanSource(e.target.value)}>
            <option value="">All Scan Types</option>
            <option value="ANPR">ANPR</option>
            <option value="MANUAL">Manual</option>
          </select>

          <input
            className="border p-2 rounded"
            placeholder="Guard ID (GIDxxx)"
            value={guardId}
            onChange={(e) => setGuardId(e.target.value)}
          />

          <input
            className="border p-2 rounded md:col-span-2"
            placeholder="Search vehicle number"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
          />

          <input
            type="date"
            className="border p-2 rounded"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <input
            type="date"
            className="border p-2 rounded"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brown/10">
              <tr>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Entry Time</th>
                <th className="p-3">Exit Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Source</th>
                <th className="p-3">Scan</th>
                <th className="p-3">Guard</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b hover:bg-cream/40 transition">
                  <td className="p-3 font-mono">{log.vehicleNo}</td>
                  <td className="p-3">
                    {log.entryTime ? new Date(log.entryTime).toLocaleString() : "—"}
                  </td>
                  <td className="p-3">
                    {log.exitTime ? new Date(log.exitTime).toLocaleString() : "—"}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${statusBadge(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${sourceBadge(log.source)}`}>
                      {log.source}
                    </span>
                  </td>
                  <td className="p-3">{log.scanSource}</td>
                  <td className="p-3">{log.guardId || "—"}</td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-500">
                    No vehicle logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
