import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import API from "../../services/api";

export default function OccasionalVisitorsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visitors, setVisitors] = useState([]);

  // 🔹 FILTER STATES
  const [search, setSearch] = useState("");
  const [visitorType, setVisitorType] = useState("");
  const [hasVehicle, setHasVehicle] = useState("");
  const [companions, setCompanions] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔹 FETCH VISITORS WITH FILTERS
  const fetchVisitors = async () => {
    try {
      let params = [];

      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (visitorType) params.push(`visitorType=${visitorType}`);
      if (hasVehicle) params.push(`hasVehicle=${hasVehicle}`);
      if (companions) params.push(`companions=${companions}`);
      if (fromDate) params.push(`fromDate=${fromDate}`);
      if (toDate) params.push(`toDate=${toDate}`);

      const query = params.length ? `?${params.join("&")}` : "";
      const res = await API.get(`/occasional-visitors${query}`);

      setVisitors(res.data.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch occasional visitors", "error");
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [search, visitorType, hasVehicle, companions, fromDate, toDate]);

  // ❌ DELETE VISITOR
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Remove visitor?",
      text: "This record will be permanently deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7B4B2A",
      confirmButtonText: "Yes, remove"
    });

    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/occasional-visitors/${id}`);
      Swal.fire("Removed", "Visitor entry removed", "success");
      fetchVisitors();
    } catch {
      Swal.fire("Error", "Failed to remove visitor", "error");
    }
  };

  // 🔹 BADGES
  const typeBadge = (type) =>
    type === "Parent"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";

  const vehicleBadge = (vehicleNo) =>
    vehicleNo
      ? "bg-purple-100 text-purple-800"
      : "bg-gray-100 text-gray-700";

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/90 text-brown">
      <HeaderNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        adminName="Admin"
      />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="px-6 md:px-12 lg:px-20 py-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            👥 Occasional Visitors
          </h1>
        </div>

        {/* 🔍 FILTER CARD */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6 grid grid-cols-1 md:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Search by name / phone / vehicle / reason"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded md:col-span-2"
          />

          <select
            value={visitorType}
            onChange={(e) => setVisitorType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Types</option>
            <option value="Parent">Parent</option>
            <option value="Non-Parent">Non-Parent</option>
          </select>


          <select
            value={companions}
            onChange={(e) => setCompanions(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Companions</option>
            <option value="solo">Solo</option>
            <option value="group">With Companions</option>
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded"
          />

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brown/10">
              <tr>
                <th className="p-3">Visitor</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Type</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Companions</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Visit Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-6 text-gray-500">
                    No occasional visitors found
                  </td>
                </tr>
              ) : (
                visitors.map((v) => (
                  <tr
                    key={v._id}
                    className="border-b hover:bg-cream/50 transition"
                  >
                    <td className="p-3 font-medium">{v.visitorName}</td>
                    <td className="p-3 font-mono">{v.phoneNumber}</td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${typeBadge(
                          v.visitorType
                        )}`}
                      >
                        {v.visitorType}
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${vehicleBadge(
                          v.vehicleNo
                        )}`}
                      >
                        {v.vehicleNo || "No Vehicle"}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      {v.noOfCompanions}
                    </td>

                    <td className="p-3">{v.reason}</td>

                    <td className="p-3">
                      {new Date(v.dateOfVisit).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(v._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
