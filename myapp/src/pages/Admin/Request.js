import React, { useEffect, useState } from "react";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function AdminRequests() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  /* ================= FETCH PENDING REQUESTS ================= */
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/requests/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Fetch requests error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ================= APPROVE ================= */
  const handleApprove = async (id) => {
  const result = await Swal.fire({
    title: "Approve Request?",
    text: "This visitor will be allowed campus access.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#7B4B2A",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Approve",
    background: "#F8F3ED"
  });

  if (!result.isConfirmed) return;

  try {
    await axios.post(
      `http://localhost:5000/api/admin/requests/${id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    await Swal.fire({
      title: "Approved!",
      text: "Visitor request has been approved successfully.",
      icon: "success",
      confirmButtonColor: "#7B4B2A",
      background: "#F8F3ED"
    });

    fetchRequests();
  } catch (err) {
    Swal.fire({
      title: "Error",
      text: "Approval failed. Please try again.",
      icon: "error",
      confirmButtonColor: "#7B4B2A",
      background: "#F8F3ED"
    });
  }
};

  /* ================= REJECT ================= */
  const handleReject = async (id) => {
  const result = await Swal.fire({
    title: "Reject Request?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#7B4B2A",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Reject",
    background: "#F8F3ED"
  });

  if (!result.isConfirmed) return;

  try {
    await axios.post(
      `http://localhost:5000/api/admin/requests/${id}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    await Swal.fire({
      title: "Rejected",
      text: "Visitor request has been rejected.",
      icon: "success",
      confirmButtonColor: "#7B4B2A",
      background: "#F8F3ED"
    });

    fetchRequests();
  } catch (err) {
    Swal.fire({
      title: "Error",
      text: "Rejection failed. Please try again.",
      icon: "error",
      confirmButtonColor: "#7B4B2A",
      background: "#F8F3ED"
    });
  }
};


  return (
    <div className="min-h-screen bg-cream text-brown">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= MAIN ================= */}
      <main className="px-6 md:px-12 py-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-extrabold">
            Pending Visitor Requests
          </h1>
          <p className="text-sm text-brown/60 mt-1">
            Review and approve or reject visitor access requests
          </p>
        </motion.div>

        {/* ================= CONTENT ================= */}
        {loading ? (
          <div className="text-center py-20">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 text-brown/60">
            No pending requests 🎉
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {requests.map((req) => (
              <motion.div
                key={req._id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {req.visitorName}
                    </h3>
                    <p className="text-sm text-brown/60">
                      Phone: {req.phoneNumber}
                    </p>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(req.dateOfVisit).toDateString()}
                  </p>
                  <p>
                    <strong>Vehicle:</strong>{" "}
                    {req.vehicleNumber || "N/A"}
                  </p>
                  <p>
                    <strong>People:</strong> {req.numberOfPeople}
                  </p>
                  <p>
                    <strong>Reason:</strong> {req.otherReason}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => handleApprove(req._id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(req._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
