// AGSS-BV/myapp/src/pages/Guard/FaceConsent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import HeaderNavbar from "../../components/HeaderNavbar3";
import Sidebar2 from "../../components/Sidebar2";
import Footer from "../../components/Footer";

export default function FaceConsent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [consent, setConsent] = useState(false);
  const [studentId, setStudentId] = useState("");
    const navigate = useNavigate();
  useEffect(() => {
    const id = localStorage.getItem("student_id");
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Please register the student first.",
        confirmButtonColor: "#7c4a2d",
      });
    } else {
      setStudentId(id);
    }
  }, []);

  const handleSubmit = async () => {
    if (!consent) {
      Swal.fire({
        icon: "warning",
        title: "Consent Required",
        text: "You must agree before proceeding.",
        confirmButtonColor: "#7c4a2d",
      });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/face-enroll/init",
        {
          student_id: studentId,
          consent: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Consent Recorded",
        text: "Face enrollment process will now begin.",
        confirmButtonColor: "#7c4a2d",
      }).then((result) => {
  if (result.isConfirmed) {
    navigate("/guard/face-enrollment");
  }
});

      // 👉 Navigate to Step 3 (Face Enrollment)
      // e.g. navigate("/student/face-enroll");
      console.log("NEXT STEP:", res.data.nextStep);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Unable to initiate enrollment",
        confirmButtonColor: "#7c4a2d",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f1] to-[#f3eae3] flex flex-col">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1">
        <Sidebar2 sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-8 md:p-12 flex items-center justify-center">
          <div className="bg-white shadow-xl rounded-xl p-10 max-w-xl w-full">
            <h1 className="text-2xl font-bold text-brown-800 mb-4 text-center">
              Face Enrollment Consent
            </h1>

            <p className="text-gray-600 mb-6 text-center">
              Student ID:{" "}
              <span className="font-semibold text-brown-700">
                {studentId}
              </span>
            </p>

            <div className="border rounded-md p-5 bg-[#f9f6f2] mb-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                By proceeding, you consent to the capture and processing of
                facial biometric data for campus security purposes only.
                <br />
                <br />
                The data will be securely stored and used strictly in accordance
                with institutional policies.
              </p>
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="consent"
                className="mr-3 h-4 w-4"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <label htmlFor="consent" className="text-gray-700">
                I agree to the above terms and consent to face enrollment
              </label>
            </div>

            <div className="text-center">
              <button
                onClick={handleSubmit}
                className="px-12 py-3 bg-[#7c4a2d] text-white rounded-md hover:bg-[#5f3a22] transition font-semibold"
              >
                Start Face Enrollment
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
