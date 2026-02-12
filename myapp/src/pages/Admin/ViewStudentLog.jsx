import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";

export default function AdminCurrentStatus() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [insideCount, setInsideCount] = useState(0);
  const [outsideCount, setOutsideCount] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(false);

  // ✅ FIXED TOKEN RETRIEVAL
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  const fetchStatus = async () => {
    try {
      setLoading(true);

      let url = `http://localhost:5000/api/admin/current-status?page=${page}&limit=${limit}`;
      if (statusFilter !== "all") url += `&status=${statusFilter}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ AUTH GUARD
      if (res.status === 401) {
        Swal.fire("Session Expired", "Please login again", "warning");
        return;
      }

      const data = await res.json();

      setStudents(data.students || []);
      setInsideCount(data.insideCount || 0);
      setOutsideCount(data.outsideCount || 0);
    } catch (err) {
      Swal.fire("Error", "Unable to load admin status data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [page, statusFilter]);

  const filteredStudents = students.filter(s =>
    `${s.studentId} ${s.studentName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7eddc] to-[#efe0c6]">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="px-8 py-24 text-[#5C3A21]">
        <div className="max-w-7xl mx-auto bg-[#fffaf4] rounded-[2.5rem] shadow-[0_25px_70px_rgba(123,75,42,0.25)] p-10">

          <h2 className="text-4xl font-extrabold text-center mb-2">
            Admin — Live Campus Status
          </h2>
          <p className="text-center opacity-70 mb-10">
            Real-time view of all students inside & outside campus
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-green-100 rounded-2xl p-6 text-center shadow">
              <p className="text-lg font-semibold text-green-800">Students Inside</p>
              <p className="text-4xl font-extrabold text-green-700">{insideCount}</p>
            </div>
            <div className="bg-red-100 rounded-2xl p-6 text-center shadow">
              <p className="text-lg font-semibold text-red-800">Students Outside</p>
              <p className="text-4xl font-extrabold text-red-700">{outsideCount}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between mb-6">
            <input
              type="text"
              placeholder="Search by Student ID or Name"
              className="p-3 rounded-xl border w-full md:w-1/2"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              className="p-3 rounded-xl border"
              value={statusFilter}
              onChange={e => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
            >
              <option value="all">All</option>
              <option value="inside">Inside</option>
              <option value="outside">Outside</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#7B4B2A] text-white">
                  <th className="p-4 text-left">Student ID</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Time</th>
                  <th className="p-4 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr
                    key={i}
                    className={`border-b ${
                      s.status === "inside" ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <td className="p-4 font-semibold">{s.studentId}</td>
                    <td className="p-4">{s.studentName}</td>
                    <td className="p-4 font-bold">
                      {s.status === "inside" ? "🟢 Inside" : "🔴 Outside"}
                    </td>
                    <td className="p-4">
                      {s.status === "inside"
                        ? `Entry: ${s.entryTime}`
                        : `Exit: ${s.exitTime || "—"}`}
                    </td>
                    <td className="p-4">{s.duration || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <p className="text-center mt-6 font-semibold">
              Loading live status…
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
