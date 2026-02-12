import React, { useState, useEffect } from "react";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import API from "../../services/api";
import Swal from "sweetalert2";

export default function WhitelistPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [whitelist, setWhitelist] = useState([]);

  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [search, setSearch] = useState("");

  const fetchWhitelist = async () => {
    try {
      let params = [];
      if (type) params.push(`type=${encodeURIComponent(type)}`);
      if (gender) params.push(`gender=${gender}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);

      const query = params.length ? `?${params.join("&")}` : "";
      const res = await API.get(`/whitelist${query}`);
      setWhitelist(res.data.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch whitelist data", "error");
    }
  };

  useEffect(() => {
    fetchWhitelist();
  }, [type, gender, search]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Remove from whitelist?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7B4B2A",
      confirmButtonText: "Yes, remove"
    });

    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/whitelist/${id}`);
      Swal.fire("Removed", "Vehicle removed from whitelist", "success");
      fetchWhitelist();
    } catch {
      Swal.fire("Error", "Failed to remove", "error");
    }
  };

  const handleAddVehicle = async () => {
    const { value } = await Swal.fire({
      title: "Add Vehicle to Whitelist",
      html: `
        <input id="ownerName" class="swal2-input" placeholder="Owner Name">
        <input id="vehicleNo" class="swal2-input" placeholder="Vehicle Number">
        <select id="type" class="swal2-input">
          <option value="">Select Type</option>
          <option value="faculty">Faculty</option>
          <option value="staff">Staff</option>
          <option value="staff family">Staff Family</option>
          <option value="shop owner">Shop Owner</option>
          <option value="hospital worker">Hospital Worker</option>
          <option value="hostel worker">Hostel Worker</option>
          <option value="worker">Worker</option>
        </select>
        <input id="reference" class="swal2-input" placeholder="Reference Faculty (if staff family)">
        <select id="gender" class="swal2-input">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      `,
      showCancelButton: true,
      preConfirm: () => {
        const vehicleOwnerName = document.getElementById("ownerName").value.trim();
        const vehicleNo = document.getElementById("vehicleNo").value.trim().toUpperCase();
        const type = document.getElementById("type").value;
        const referenceFacultyName = document.getElementById("reference").value.trim();
        const gender = document.getElementById("gender").value;

        if (!vehicleOwnerName || !vehicleNo || !type || !gender) {
          Swal.showValidationMessage("Please fill all required fields");
          return;
        }
        if (type === "staff family" && !referenceFacultyName) {
          Swal.showValidationMessage("Reference faculty/staff is required");
          return;
        }
        return { vehicleOwnerName, vehicleNo, type, referenceFacultyName, gender };
      }
    });

    if (value) {
      try {
        await API.post("/whitelist", value);
        Swal.fire("Success", "Vehicle added to whitelist", "success");
        fetchWhitelist();
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to add", "error");
      }
    }
  };

  const typeBadge = (type) => {
    const map = {
      faculty: "bg-green-100 text-green-800",
      staff: "bg-blue-100 text-blue-800",
      "staff family": "bg-purple-100 text-purple-800",
      "shop owner": "bg-yellow-100 text-yellow-800",
      "hospital worker": "bg-pink-100 text-pink-800",
      "hostel worker": "bg-indigo-100 text-indigo-800",
      worker: "bg-gray-100 text-gray-800"
    };
    return map[type] || "bg-gray-100";
  };

  const genderBadge = (gender) =>
    gender === "female"
      ? "bg-pink-100 text-pink-700"
      : gender === "male"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-700";

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/90 text-brown">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} adminName="Admin" />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="px-6 md:px-12 lg:px-20 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Whitelist</h1>
          <button
            onClick={handleAddVehicle}
            className="bg-gradient-to-r from-[#7B4B2A] to-[#9C6644] text-cream px-5 py-2 rounded-lg shadow hover:scale-105 transition"
          >
            + Add Vehicle
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="border p-2 rounded" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All Types</option>
            <option value="faculty">Faculty</option>
            <option value="staff">Staff</option>
            <option value="staff family">Staff Family</option>
            <option value="shop owner">Shop Owner</option>
            <option value="hospital worker">Hospital Worker</option>
            <option value="hostel worker">Hostel Worker</option>
            <option value="worker">Worker</option>
          </select>

          <select className="border p-2 rounded" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            className="border p-2 rounded md:col-span-2"
            placeholder="Search by name / reference / vehicle"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brown/10">
              <tr>
                <th className="p-3">Owner</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Type</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Reference</th>
                <th className="p-3">Added On</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {whitelist.map((item) => (
                <tr key={item._id} className="border-b hover:bg-cream/40 transition">
                  <td className="p-3">{item.vehicleOwnerName}</td>
                  <td className="p-3 font-mono">{item.vehicleNo}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${typeBadge(item.type)}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${genderBadge(item.gender)}`}>
                      {item.gender}
                    </span>
                  </td>
                  <td className="p-3">
                    {item.type === "staff family" ? item.referenceFacultyName : "—"}
                  </td>
                  <td className="p-3">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {whitelist.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-500">
                    No whitelist records found
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
