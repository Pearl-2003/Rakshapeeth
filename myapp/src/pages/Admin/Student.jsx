import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";
import axios from "axios";

const FLASK_API = "http://localhost:4000";

export default function StudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await axios.get(`${FLASK_API}/admin/students${query}`);
      setStudents(res.data.students);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch students", "error");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  /* ================= DELETE STUDENT ================= */
  const handleDelete = async (studentId) => {
    const confirm = await Swal.fire({
      title: "Delete student?",
      text: "All biometric data will be permanently removed",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7B4B2A",
      confirmButtonText: "Yes, Delete"
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${FLASK_API}/admin/students/${studentId}`);
      Swal.fire("Deleted", "Student removed successfully", "success");
      fetchStudents();
    } catch (err) {
      Swal.fire("Error", "Failed to delete student", "error");
    }
  };

  /* ================= EDIT STUDENT ================= */
  const handleEdit = async (student) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Student & Parent Details",
      width: "46rem",
      html: `
        <h4 style="margin-bottom:8px; text-align:left;">Student Details</h4>
        <input id="firstName" class="swal2-input" placeholder="First Name" value="${student.firstName || ""}">
        <input id="lastName" class="swal2-input" placeholder="Last Name" value="${student.lastName || ""}">
        <input id="studentEmail" class="swal2-input" placeholder="Student Email" value="${student.studentEmail || ""}">
        <input id="studentPhone" class="swal2-input" placeholder="Student Phone" value="${student.studentPhone || ""}">
        <input id="course" class="swal2-input" placeholder="Course" value="${student.course || ""}">
        <hr style="margin:16px 0;" />
        <h4 style="margin-bottom:8px; text-align:left;">Father Details</h4>
        <input id="fatherEmail" class="swal2-input" placeholder="Father Email" value="${student.fatherEmail || ""}">
        <input id="fatherPhone" class="swal2-input" placeholder="Father Phone" value="${student.fatherPhone || ""}">
        <hr style="margin:16px 0;" />
        <h4 style="margin-bottom:8px; text-align:left;">Mother Details</h4>
        <input id="motherEmail" class="swal2-input" placeholder="Mother Email" value="${student.motherEmail || ""}">
        <input id="motherPhone" class="swal2-input" placeholder="Mother Phone" value="${student.motherPhone || ""}">
      `,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      confirmButtonColor: "#7B4B2A",
      focusConfirm: false,
      preConfirm: () => ({
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        studentEmail: document.getElementById("studentEmail").value.trim(),
        studentPhone: document.getElementById("studentPhone").value.trim(),
        course: document.getElementById("course").value.trim(),
        fatherEmail: document.getElementById("fatherEmail").value.trim(),
        fatherPhone: document.getElementById("fatherPhone").value.trim(),
        motherEmail: document.getElementById("motherEmail").value.trim(),
        motherPhone: document.getElementById("motherPhone").value.trim()
      })
    });

    if (!formValues) return;

    try {
      await axios.put(
        `${FLASK_API}/admin/students/${student.student_id}`,
        formValues
      );
      Swal.fire("Updated", "Student & parent details updated successfully ✅", "success");
      fetchStudents();
    } catch (err) {
      Swal.fire("Error", "Failed to update student details", "error");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/90 text-brown">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="px-6 md:px-12 lg:px-20 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Students</h1>

          <button
            onClick={() => navigate("/admin/add-student")}
            className="bg-[#7B4B2A] text-cream px-4 py-2 rounded"
          >
            + Add Student
          </button>
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <input
            type="text"
            placeholder="Search by Student ID / Name / Course"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-brown"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-brown/20">
              <tr>
                <th className="p-3">Student ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Course</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.student_id} className="border-b hover:bg-cream/50">
                    <td className="p-3 font-semibold">{s.student_id}</td>
                    <td className="p-3">
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="p-3">{s.studentPhone || "—"}</td>
                    <td className="p-3">{s.course || "—"}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.student_id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
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
