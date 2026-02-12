import React, { useState, useEffect } from "react";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

const API = "http://localhost:4000";

export default function AdminCreateGatepass() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState("");

  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showGatepassTab, setShowGatepassTab] = useState(false);
  const [exitDate, setExitDate] = useState("");
  const [exitTime, setExitTime] = useState("");

  /* ---------------- ADMIN NAME ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAdminName(decoded.name || "Admin");
      } catch {}
    }
  }, []);

  /* ---------------- VERIFY STUDENT ---------------- */
  const verifyStudent = async () => {
    if (!studentId.trim()) {
      Swal.fire("Missing ID", "Please enter Student ID", "warning");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API}/admin/verify-student`, {
        student_id: studentId,
      });

      setStudent(res.data.student);
      Swal.fire("Verified ✅", "Student details fetched", "success");
    } catch (err) {
      setStudent(null);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Student not found",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CREATE GATEPASS ---------------- */
  const createGatepass = async () => {
    if (!exitDate || !exitTime) {
      Swal.fire("Missing Fields", "Please select exit date & time", "warning");
      return;
    }

    try {
      await axios.post(`${API}/admin/create-gatepass`, {
        student_id: studentId,
        expectedExitDate: exitDate,
        expectedExitTime: exitTime,
      });

      Swal.fire(
        "Gatepass Created 🎉",
        "Parent has been notified via WhatsApp",
        "success"
      );

      setShowGatepassTab(false);
      setStudent(null);
      setStudentId("");
      setExitDate("");
      setExitTime("");
    } catch (err) {
      Swal.fire(
        "Failed",
        err.response?.data?.message || "Gatepass creation failed",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/90 font-sans text-brown">
      <HeaderNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        adminName={adminName}
      />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main className="relative z-20 px-6 md:px-12 lg:px-20 py-10">
        {/* PAGE HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Create Gatepass
          </h1>
          <p className="mt-2 text-sm text-brown/70">
            Verify student → assign exit date & time → notify parents
          </p>
        </motion.header>

        {/* STEP 1: STUDENT VERIFICATION */}
        <motion.section
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 shadow-xl mb-8"
        >
          <h3 className="font-semibold text-lg mb-4">Student Verification</h3>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter Student ID"
              className="flex-1 px-4 py-3 border rounded-xl border-brown/30 focus:outline-none"
            />

            <button
              onClick={verifyStudent}
              className="px-6 py-3 bg-[#7B4B2A] text-cream rounded-xl shadow hover:scale-105 transition"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </motion.section>

        {/* STEP 2: STUDENT DETAILS */}
        {student && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-xl mb-8"
          >
            <h3 className="font-semibold text-lg mb-4">Student Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-brown/60">Student ID:</span> <b>{student.student_id}</b></div>
              <div><span className="text-brown/60">Name:</span> <b>{student.firstName} {student.lastName}</b></div>
              <div><span className="text-brown/60">Course:</span> <b>{student.course}</b></div>
              <div><span className="text-brown/60">Father Phone:</span> <b>{student.fatherPhone || "N/A"}</b></div>
              <div><span className="text-brown/60">Mother Phone:</span> <b>{student.motherPhone || "N/A"}</b></div>
            </div>

            <button
              onClick={() => setShowGatepassTab(true)}
              className="mt-6 px-6 py-3 bg-[#7B4B2A] text-cream rounded-xl shadow hover:scale-105 transition"
            >
              Create Gatepass
            </button>
          </motion.section>
        )}

        {/* STEP 3: GATEPASS TAB */}
        {showGatepassTab && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-xl mb-12"
          >
            <h3 className="font-semibold text-lg mb-4">Assign Exit Date & Time</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-1">Exit Date</label>
                <input
                  type="date"
                  value={exitDate}
                  onChange={(e) => setExitDate(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl border-brown/30"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Exit Time</label>
                <input
                  type="time"
                  value={exitTime}
                  onChange={(e) => setExitTime(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl border-brown/30"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={createGatepass}
                className="px-6 py-3 bg-[#7B4B2A] text-cream rounded-xl shadow hover:scale-105 transition"
              >
                Confirm Gatepass
              </button>

              <button
                onClick={() => setShowGatepassTab(false)}
                className="px-6 py-3 bg-cream border border-brown/30 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </motion.section>
        )}
      </main>

      <Footer />
    </div>
  );
}
