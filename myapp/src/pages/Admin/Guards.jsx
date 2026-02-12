import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import API from "../../services/api";

const MySwal = withReactContent(Swal);

export default function GuardsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [guards, setGuards] = useState([]);

  // 🔹 Filters (UI only)
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");

  // ✅ Fetch guards (same backend logic)
  const fetchGuards = async () => {
    try {
      let query = [];
      if (search) query.push(`search=${search}`);
      if (gender !== "All") query.push(`gender=${gender}`);

      const qs = query.length ? `?${query.join("&")}` : "";
      const res = await API.get(`/guard${qs}`);
      setGuards(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch guards", "error");
    }
  };

  useEffect(() => {
    fetchGuards();
  }, [search, gender]);

  // ✅ ADD GUARD
  const handleAddGuard = async () => {
    const { value } = await MySwal.fire({
      title: "Add New Guard",
      html: `
        <input id="firstName" class="swal2-input" placeholder="First Name">
        <input id="lastName" class="swal2-input" placeholder="Last Name">

        <select id="gender" class="swal2-select">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input id="phone" class="swal2-input" placeholder="Phone">
        <input id="email" class="swal2-input" placeholder="Email (optional)">
        <input id="password" type="password" class="swal2-input" placeholder="Password">
      `,
      preConfirm: () => {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const gender = document.getElementById("gender").value;
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!firstName || !lastName || !gender || !phone || !password) {
          Swal.showValidationMessage("Please fill all required fields");
          return;
        }

        return { firstName, lastName, gender, phone, email, password };
      },
      showCancelButton: true,
      confirmButtonColor: "#7B4B2A",
    });

    if (value) {
      await API.post("/guard", value);
      Swal.fire("Success", "Guard added successfully", "success");
      fetchGuards();
    }
  };

  // ✅ EDIT GUARD
  const handleEditGuard = async (guard) => {
    const { value } = await MySwal.fire({
      title: "Edit Guard",
      html: `
        <input id="firstName" class="swal2-input" value="${guard.firstName}">
        <input id="lastName" class="swal2-input" value="${guard.lastName}">

        <select id="gender" class="swal2-select">
          <option value="Male" ${guard.gender === "Male" ? "selected" : ""}>Male</option>
          <option value="Female" ${guard.gender === "Female" ? "selected" : ""}>Female</option>
          <option value="Other" ${guard.gender === "Other" ? "selected" : ""}>Other</option>
        </select>

        <input id="phone" class="swal2-input" value="${guard.phone}">
        <input id="email" class="swal2-input" value="${guard.email || ""}">
      `,
      preConfirm: () => {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const gender = document.getElementById("gender").value;
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();

        if (!firstName || !lastName || !gender || !phone) {
          Swal.showValidationMessage("All required fields must be filled");
          return;
        }

        return { firstName, lastName, gender, phone, email };
      },
      showCancelButton: true,
    });

    if (value) {
      await API.put(`/guard/${guard._id}`, value);
      Swal.fire("Updated", "Guard updated successfully", "success");
      fetchGuards();
    }
  };

  // ✅ DELETE GUARD
  const handleDeleteGuard = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently remove the guard",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    await API.delete(`/guard/${id}`);
    Swal.fire("Removed", "Guard removed successfully", "success");
    fetchGuards();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/90 text-brown">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} adminName="Admin" />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="px-6 md:px-12 lg:px-20 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Guards</h1>
          <button
            onClick={handleAddGuard}
            className="bg-gradient-to-r from-[#7B4B2A] to-[#A76A3A] text-cream px-5 py-2 rounded-full shadow-lg hover:scale-105"
          >
            + Add Guard
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex gap-4 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name or phone"
            className="flex-1 px-4 py-2 rounded-full border focus:ring-2 focus:ring-brown"
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="px-4 py-2 rounded-full border bg-cream"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
          <table className="w-full table-fixed">
            <thead className="bg-brown/20">
              <tr>
                <th className="p-3 text-left w-[12%]">Guard ID</th>
                <th className="p-3 text-left w-[22%]">Name</th>
                <th className="p-3 text-center w-[12%]">Gender</th>
                <th className="p-3 text-left w-[18%]">Phone</th>
                <th className="p-3 text-left w-[24%]">Email</th>
                <th className="p-3 text-center w-[12%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-6">
                    No guards found
                  </td>
                </tr>
              ) : (
                guards.map((g) => (
                  <tr key={g._id} className="border-b hover:bg-cream/60">
                    <td className="p-3 font-semibold">{g.guardId}</td>
                    <td className="p-3">{g.firstName} {g.lastName}</td>

                    <td className="p-3 text-center">
                      {g.gender ? (
                        <span className="inline-flex justify-center px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                          {g.gender}
                        </span>
                      ) : (
                        <span className="inline-block w-6 h-6 rounded-full bg-blue-100" />
                      )}
                    </td>

                    <td className="p-3">{g.phone}</td>
                    <td className="p-3 break-all">{g.email || "—"}</td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditGuard(g)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGuard(g._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
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
