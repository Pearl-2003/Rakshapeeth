// AGSS-BV/myapp/src/pages/Guard/FaceTraining.jsx 
import React, { useEffect,useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import HeaderNavbar from "../../components/HeaderNavbar3";
import Sidebar2 from "../../components/Sidebar2";
import Footer from "../../components/Footer";


export default function FaceTraining() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState("");
    const hasCalledRef = useRef(false);

 useEffect(() => {
  if (hasCalledRef.current) return;   // ⛔ block second call
  hasCalledRef.current = true;        // ✅ mark as called

  const id = localStorage.getItem("student_id");

  if (!id) {
    Swal.fire({
      icon: "error",
      title: "Session Expired",
      text: "Student registration not found.",
      confirmButtonColor: "#7c4a2d",
    });
    return;
  }

  setStudentId(id);
  completeEnrollment(id);
}, []);


  const completeEnrollment = async (id) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/face-enroll/complete",
        {
          student_id: id,
        }
      );

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Biometric Setup Complete",
          text: "Face profile secured successfully.",
          confirmButtonColor: "#7c4a2d",
        });

        // 👉 move to Step 5
        // navigate("/student/face-verify");
      } else {
        throw new Error("Training failed");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Training Failed",
        text:
          err.response?.data?.message ||
          "Unable to generate face model. Please retry enrollment.",
        confirmButtonColor: "#7c4a2d",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f1] to-[#f3eae3] flex flex-col">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1">
        <Sidebar2 sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-8 md:p-12 flex items-center justify-center">
          <div className="bg-white shadow-xl rounded-xl p-12 text-center max-w-lg w-full">
            {loading ? (
              <>
                {/* Loader */}
                <div className="flex justify-center mb-6">
                  <div className="w-14 h-14 border-4 border-brown-700 border-t-transparent rounded-full animate-spin"></div>
                </div>

                <h2 className="text-2xl font-bold text-brown-800 mb-2">
                  Securing Biometric Profile
                </h2>

                <p className="text-gray-600">
                  Please wait while we generate your face model.
                </p>

                <p className="text-sm text-gray-500 mt-4">
                  Student ID:{" "}
                  <span className="font-semibold text-brown-700">
                    {studentId}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-gray-600">
                Processing complete. Redirecting…
              </p>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
