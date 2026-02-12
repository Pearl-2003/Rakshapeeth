//verifyIris.js
import { useState, useRef, useEffect } from "react";
import HeaderNavbar from "../../components/HeaderNavbar3";
import Sidebar from "../../components/Sidebar2";
import Footer from "../../components/Footer";
import GuardAlertModal from "../../components/GuardAlertModal";
import GuardNotificationsBar from "../../components/GuardNotificationsBar";

import Swal from "sweetalert2";

export default function VerifyIris() {
  const [studentId, setStudentId] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [alertOpen, setAlertOpen] = useState(false);
const [failureReason, setFailureReason] = useState("");
const [alertType, setAlertType] = useState(""); // ENTRY or EXIT

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const VERIFY_URL = "http://localhost:4000/verify";
  const ENTRY_URL = "http://localhost:4000/verify-entry";


  /* ================= CAMERA LOGIC (UNCHANGED) ================= */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setStreaming(true);
      setCaptured(false);
    } catch (err) {
      alert("Camera not accessible: " + err.message);
    }
  };

  useEffect(() => {
    if (streaming && videoRef.current && streamRef.current && !captured) {
      videoRef.current.srcObject = streamRef.current;
    }
    console.log("alertOpen:", alertOpen);
  }, [streaming, captured,alertOpen]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStreaming(false);
    setCaptured(false);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      setImage(blob);
      setCaptured(true);
    }, "image/jpeg", 0.9);
  };

  const handleRecapture = () => {
    setCaptured(false);
    setImage(null);
  };

  /* ================= VERIFY LOGIC (UNCHANGED) ================= */
  const handleVerify = async () => {
  if (!studentId) {
    Swal.fire("Missing ID", "Student ID is required", "warning");
    return;
  }

  if (!image) {
    Swal.fire("Missing Image", "Capture or upload iris image", "warning");
    return;
  }

  setLoading(true);
  setStatus("");

  try {
    const formData = new FormData();
    formData.append("student_id", studentId);
    formData.append("image", image, "iris.jpg");

    /* ================= TRY ENTRY FIRST ================= */
    let res = await fetch(ENTRY_URL, {
      method: "POST",
      body: formData
    });

    let data = await res.json();

    // ❌ Iris mismatch (common for entry & exit)
    if (data.match === false) {
  setLoading(false);
  setFailureReason("Iris mismatch");
  setAlertType("ENTRY");

  Swal.fire({
    title: "Access Denied ❌",
    text: "Iris mismatch",
    icon: "error",
    showCancelButton: true,
    confirmButtonText: "🚨 Send Alert to Admin",
    cancelButtonText: "Close"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.close();          // 🔥 ADD THIS
      setAlertOpen(true);
    }
  });

  setStatus("NOT MATCH ❌ Access Denied");
  return;
}



    // ✅ ENTRY ALLOWED
    if (data.match === true && data.entryAllowed === true) {
      setLoading(false);
      Swal.fire({
        title: "Entry Allowed ✅",
        html: `
          <b>Date:</b> ${data.entryDate}<br/>
          <b>Time:</b> ${data.entryTime}
        `,
        icon: "success"
      });
      setStatus("MATCH ✅ Entry Allowed");
      return;
    }

    /* ================= IF ALREADY INSIDE → TRY EXIT ================= */
   if (
      data.match === true &&
      data.entryAllowed === false &&
      data.reason === "Student already inside campus"
    ) {
      res = await fetch(VERIFY_URL, {
        method: "POST",
        body: formData
      });

      data = await res.json();
      setLoading(false);

      // ❌ Iris mismatch
     if (data.match === false) {
  setLoading(false);
  setFailureReason("Iris mismatch");
  setAlertType("EXIT");   // ✅ FIXED

  Swal.fire({
    title: "Access Denied ❌",
    text: "Iris mismatch",
    icon: "error",
    showCancelButton: true,
    confirmButtonText: "🚨 Send Alert to Admin",
    cancelButtonText: "Close"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.close();        // 🔥 ADD THIS
      setAlertOpen(true);
    }
  });

  setStatus("NOT MATCH ❌ Access Denied");
  return;
}



     if (data.match === true && data.exitAllowed === false) {
  setFailureReason(data.reason);
  setAlertType("EXIT");

  Swal.fire({
    title: "Exit Denied 🚫",
    text: data.reason,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "🚨 Send Alert to Admin",
    cancelButtonText: "Close"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.close();        // 🔥 ADD THIS
      setAlertOpen(true);
    }
  });

  setStatus(`DENIED ❌ ${data.reason}`);
  return;
}



      // ✅ Exit allowed
      if (data.match === true && data.exitAllowed === true) {
        Swal.fire({
          title: "Exit Allowed ✅",
          html: `
            <b>Date:</b> ${data.exitDate}<br/>
            <b>Time:</b> ${data.exitTime}
          `,
          icon: "success",
          confirmButtonText: "Proceed"
        });
        setStatus("MATCH ✅ Exit Allowed");
        return;
      }
    }

    /* ================= OTHER ENTRY DENIAL ================= */
    setLoading(false);
    Swal.fire("Entry Denied 🚫", data.reason || "Entry not permitted", "warning");
    setStatus(`DENIED ❌ ${data.reason}`);

  } catch (err) {
    setLoading(false);
    Swal.fire("Error", err.message, "error");
    setStatus("ERROR ❌ " + err.message);
  }
};




  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7eddc] via-[#f3e5cf] to-[#efe0c6] text-[#5C3A21]">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex justify-center items-center px-6 py-20">
        {/* 🔥 MAIN CARD */}
        <div
          className="bg-[#fffaf4] rounded-[2.5rem]
          shadow-[0_25px_70px_rgba(123,75,42,0.25)]
          border border-[#7B4B2A]/30
          w-full max-w-2xl p-12"
        >
          <h2 className="text-3xl font-extrabold text-center text-[#5C3A21]">
            Iris Verification
          </h2>

          <p className="text-center text-[#7B4B2A] opacity-80 mb-10">
            Automated Gate Security System – AGSS-BV
          </p>

          {/* STUDENT ID */}
         <label className="block text-sm font-semibold mb-2 text-[#5C3A21]">
            Student ID
          </label>
          <input
            className="w-full p-4 rounded-2xl border border-[#7B4B2A]/40 bg-white
            focus:ring-2 focus:ring-[#7B4B2A] outline-none text-lg"
            placeholder="BTBTC23001"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />

          {/* FILE UPLOAD */}
          <label className="block text-sm font-semibold mt-6 mb-2 text-[#5C3A21]">
            Upload Iris Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="w-full text-sm"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="my-8 h-px bg-[#7B4B2A]/20"></div>

          {!streaming && (
            <button
              onClick={startCamera}
              className="w-full bg-gradient-to-r from-[#7B4B2A] to-[#5C3A21]
              text-[#fffaf4] py-4 rounded-2xl font-bold text-lg
              shadow-lg hover:scale-[1.03] transition"
            >
              Open Camera
            </button>
          )}

          {streaming && !captured && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full mt-6 rounded-2xl border border-[#7B4B2A]/30"
              />
              <button
                onClick={handleCapture}
                className="w-full mt-4 bg-[#7B4B2A] text-[#fffaf4]
                py-4 rounded-2xl font-semibold text-lg"
              >
                Capture Photo
              </button>
              <button
                onClick={stopCamera}
                className="w-full mt-3 bg-red-600 text-white py-3 rounded-2xl"
              >
                Close Camera
              </button>
            </>
          )}

          {streaming && captured && (
            <>
              <img
                src={URL.createObjectURL(image)}
                alt="Captured"
                className="w-full mt-6 rounded-2xl border border-[#7B4B2A]/30"
              />
              <button
                onClick={handleRecapture}
                className="w-full mt-4 bg-[#7B4B2A] text-[#fffaf4]
                py-4 rounded-2xl font-semibold"
              >
                Recapture
              </button>
              <button
                onClick={stopCamera}
                className="w-full mt-3 bg-red-600 text-white py-3 rounded-2xl"
              >
                Close Camera
              </button>
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />

          <button
            onClick={handleVerify}
            className="w-full mt-10 bg-gradient-to-r from-[#7B4B2A] to-[#5C3A21]
            text-[#fffaf4] py-4 rounded-2xl font-bold text-lg
            shadow-xl hover:scale-[1.03] transition"
          >
            Verify Iris
          </button>

          {loading && (
            <p className="text-center mt-6 text-[#7B4B2A] text-lg">
              Verifying iris…
            </p>
          )}

          {status && (
            <p
              className={`text-center mt-6 text-xl font-bold ${
                status.includes("Granted")
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </main>
      <GuardAlertModal
  open={alertOpen}
  onClose={() => setAlertOpen(false)}
  student={{
    studentId,
    studentName: studentId // replace later with full name if available
  }}
  reason={failureReason}
  alertType={alertType}
  guard={{
    id: localStorage.getItem("guardId"),
    name: localStorage.getItem("guardName")
  }}
/>
<GuardNotificationsBar
  guardId={localStorage.getItem("guardId")}
/>
      <Footer />
    </div>
  );
}