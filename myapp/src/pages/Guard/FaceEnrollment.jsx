// FaceEnrollment.jsx (IMPROVED)
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import HeaderNavbar from "../../components/HeaderNavbar3";
import Sidebar2 from "../../components/Sidebar2";
import Footer from "../../components/Footer";

const MIN_SAMPLES = 5;
const MAX_SAMPLES = 8;

export default function FaceEnrollment() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [samplesCaptured, setSamplesCaptured] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔹 Init
  useEffect(() => {
    const id = localStorage.getItem("student_id");
    if (!id) {
      Swal.fire("Error", "Student not registered", "error");
      return;
    }
    setStudentId(id);
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      videoRef.current.srcObject = stream;
    } catch {
      Swal.fire("Camera Error", "Unable to access camera", "error");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
  };

  // 🔹 Capture one sample
  const captureSample = async () => {
    if (samplesCaptured >= MAX_SAMPLES) {
      Swal.fire("Limit Reached", "Maximum 8 samples allowed", "info");
      return;
    }

    setLoading(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      try {
        const fd = new FormData();
        fd.append("student_id", studentId);
        fd.append("image", blob, "frame.jpg");

        await axios.post(
          "http://localhost:4000/api/face-enroll/sample",
          fd
        );

        setSamplesCaptured((prev) => prev + 1);
      } catch (err) {
        Swal.fire(
          "Capture Failed",
          err.response?.data?.message || "Try again",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  // 🔹 Proceed manually
  const proceedEnrollment = () => {
    if (samplesCaptured < MIN_SAMPLES) {
      Swal.fire(
        "Insufficient Samples",
        `Capture at least ${MIN_SAMPLES} face images`,
        "warning"
      );
      return;
    }

    stopCamera();
    navigate("/guard/face-training");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f1] to-[#f3eae3] flex flex-col">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1">
        <Sidebar2 sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-8 md:p-12 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-brown-800 mb-2">
            Face Enrollment
          </h1>

          <p className="text-gray-600 mb-6">
            Student ID: <b>{studentId}</b>
          </p>

          {/* Camera */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded-md w-[320px] h-[240px] bg-black"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Status */}
          <p className="text-gray-700 mb-4">
            Samples Captured:{" "}
            <b>{samplesCaptured} / {MAX_SAMPLES}</b>
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={captureSample}
              disabled={loading || samplesCaptured >= MAX_SAMPLES}
              className="px-6 py-3 bg-brown-700 text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Capturing..." : "Capture"}
            </button>

            <button
              onClick={proceedEnrollment}
              disabled={samplesCaptured < MIN_SAMPLES}
              className="px-6 py-3 bg-green-700 text-white rounded-md disabled:opacity-50"
            >
              Proceed
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-600 text-center">
            <p>✔ Minimum {MIN_SAMPLES} images required</p>
            <p>✔ Maximum {MAX_SAMPLES} images allowed</p>
            <p>✔ Slightly change angle each capture</p>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
