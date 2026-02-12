import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import API from "../../services/api";

const MySwal = withReactContent(Swal);

export default function BlacklistPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [blacklist, setBlacklist] = useState([]);

  // 🔹 FILTER STATES
  const [search, setSearch] = useState("");
  const [idType, setIdType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔹 FETCH WITH FILTERS
  const fetchBlacklist = async () => {
    try {
      let params = [];

      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (idType) params.push(`idType=${idType}`);
      if (fromDate) params.push(`fromDate=${fromDate}`);
      if (toDate) params.push(`toDate=${toDate}`);

      const query = params.length ? `?${params.join("&")}` : "";
      const res = await API.get(`/blacklist${query}`);

      setBlacklist(res.data.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch blacklist", "error");
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, [search, idType, fromDate, toDate]);

  // 🔴 REMOVE
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Remove from blacklist?",
      text: "Vehicle will be allowed again",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      confirmButtonText: "Yes, remove"
    });

    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/blacklist/${id}`);
      Swal.fire("Removed", "Vehicle removed from blacklist", "success");
      fetchBlacklist();
    } catch {
      Swal.fire("Error", "Failed to remove", "error");
    }
  };

  // ➕ ADD BLACKLIST
  const handleAddBlacklist = async () => {
    const { value } = await MySwal.fire({
      title: "Add Blacklist Entry",
      html: `
        <input id="vehicleNo" class="swal2-input" placeholder="Vehicle Number">
        <select id="idProofType" class="swal2-select">
          <option value="Aadhaar">Aadhaar</option>
          <option value="PAN">PAN</option>
          <option value="DL">Driving License</option>
        </select>
        <input id="idProofValue" class="swal2-input" placeholder="ID Proof Number">
        <input id="reason" class="swal2-input" placeholder="Reason">
      `,
      showCancelButton: true,
      confirmButtonText: "Blacklist",
      confirmButtonColor: "#7f1d1d",
      preConfirm: () => {
        const vehicleNo = document.getElementById("vehicleNo").value.trim().toUpperCase();
        const idProofType = document.getElementById("idProofType").value;
        const idProofValue = document.getElementById("idProofValue").value.trim();
        const reason = document.getElementById("reason").value.trim();

        if (!vehicleNo || !idProofValue || !reason) {
          Swal.showValidationMessage("All fields are required");
          return;
        }

        return {
          vehicleNo,
          idProof: { type: idProofType, value: idProofValue },
          reason
        };
      }
    });

    if (value) {
      try {
        await API.post("/blacklist", value);
        Swal.fire("Success", "Vehicle blacklisted successfully", "success");
        fetchBlacklist();
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to add", "error");
      }
    }
  };

  const idBadge = (type) => {
    const map = {
      Aadhaar: "bg-blue-100 text-blue-800",
      PAN: "bg-purple-100 text-purple-800",
      DL: "bg-green-100 text-green-800"
    };
    return map[type] || "bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/90 text-brown">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} adminName="Admin" />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="px-6 md:px-12 lg:px-20 py-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-700">🚨 Manage Blacklist</h1>
          <button
            onClick={handleAddBlacklist}
            className="bg-gradient-to-r from-red-700 to-red-900 text-white px-5 py-2 rounded-full shadow hover:scale-105 transition"
          >
            + Blacklist Vehicle
          </button>
        </div>

        {/* 🔍 FILTER CARD */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by vehicle / ID / reason"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded md:col-span-2"
          />

          <select
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All ID Proofs</option>
            <option value="Aadhaar">Aadhaar</option>
            <option value="PAN">PAN</option>
            <option value="DL">DL</option>
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
            <thead className="bg-red-100">
              <tr>
                <th className="p-3">Vehicle No</th>
                <th className="p-3">ID Proof</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Date Added</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {blacklist.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No blacklist entries found
                  </td>
                </tr>
              ) : (
                blacklist.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-red-50">
                    <td className="p-3 font-mono text-red-700">{item.vehicleNo}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${idBadge(item.idProof.type)}`}>
                        {item.idProof.type}
                      </span>
                      <div className="text-xs text-gray-600">{item.idProof.value}</div>
                    </td>
                    <td className="p-3 text-red-800">{item.reason}</td>
                    <td className="p-3">{new Date(item.dateAdded).toLocaleString()}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
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
