import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

import HeaderNavbar from "../../components/HeaderNavbar3";
import Sidebar2 from "../../components/Sidebar2";
import Footer from "../../components/Footer";

import { useVerificationController } from "../../hooks/useVerificationController";

export default function FaceVerify() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  /* ================= CONTEXT ================= */
  const [studentId, setStudentId] = useState("");
  const [expectedLabel, setExpectedLabel] = useState(null);
  const [contextReady, setContextReady] = useState(false);
  const [loadingContext, setLoadingContext] = useState(false);

  /* ================= CAMERA ================= */
  const [cameraOn, setCameraOn] = useState(false);
  const [faceState, setFaceState] = useState("IDLE"); 
  // IDLE | DETECTING | MATCH | MISMATCH

  /* ================= VERIFICATION CONTROLLER ================= */
  const {
    state,
    timeLeft,
    greenMatches,
    redMismatches,
    startVerification,
    stopVerification,
    registerFrameResult,
  } = useVerificationController();

  /* ============================================================
     STEP 3A — FETCH VERIFY CONTEXT
     ============================================================ */
  const fetchVerifyContext = async () => {
    try {
      setLoadingContext(true);

      const res = await fetch(
        `http://localhost:4000/api/verify-context/${studentId}`
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setExpectedLabel(data.faceLabel);
      setContextReady(true);

      Swal.fire(
        "Context Ready",
        `Student ${studentId} loaded`,
        "success"
      );
    } catch (err) {
      Swal.fire(
        "Invalid Student",
        err.message || "Unable to load verification context",
        "error"
      );
      setContextReady(false);
    } finally {
      setLoadingContext(false);
    }
  };

  /* ============================================================
     CAMERA CONTROL
     ============================================================ */
  const openCamera = async () => {
  try {
    const constraints = {
      audio: false,
      video: {
        width: { exact: 640 },
        height: { exact: 480 },
        frameRate: { ideal: 15, max: 15 },
        facingMode: "user"
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    const video = videoRef.current;
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.muted = true;

    await video.play();

    setCameraOn(true);
    setFaceState("DETECTING");
    startVerification();
  } catch (err) {
    Swal.fire("Camera Error", err.message || "Camera not accessible", "error");
  }
};



  const closeCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
    setCameraOn(false);
    stopVerification();
  };

  /* ============================================================
     FRAME LOOP (REAL BACKEND CALL)
     ============================================================ */
  useEffect(() => {
    if (!cameraOn) return;

    const interval = setInterval(() => {
      captureAndVerifyFrame();
    }, 600);

    return () => clearInterval(interval);
  }, [cameraOn]);

  /* ============================================================
     CAPTURE FRAME → BACKEND → VERIFY
     ============================================================ */
  const captureAndVerifyFrame = async () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (!video || video.videoWidth === 0) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(
    async (blob) => {
      if (!blob) {
        console.warn("❌ Blob generation failed");
        return;
      }

      try {
        const fd = new FormData();
        fd.append("image", blob, "frame.jpg"); // 🔥 KEY MUST BE 'image'

        const res = await fetch(
          "http://localhost:4000/api/face-verify-frame",
          {
            method: "POST",
            body: fd,
          }
        );

        const data = await res.json();

        if (!data.success) {
          setFaceState("DETECTING");
          return;
        }

        const { predictedLabel, confidence } = data;

        const isMatch =
          predictedLabel === expectedLabel && confidence < 85;

        setFaceState(isMatch ? "MATCH" : "MISMATCH");
        registerFrameResult(isMatch);
      } catch (err) {
        console.error("Frame verify failed", err);
      }
    },
    "image/jpeg",
    0.9
  );
};


  /* ============================================================
     FINAL RESULT
     ============================================================ */
  useEffect(() => {
    if (state === "SUCCESS") {
      closeCamera();
      Swal.fire("Verified", "Face verified successfully", "success");
    }

    if (state === "FAILURE") {
      closeCamera();
      Swal.fire("Failed", "Face verification failed", "error");
    }
  }, [state]);

  /* ============================================================
     UI
     ============================================================ */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f1] to-[#f3eae3] flex flex-col">
      <HeaderNavbar />

      <div className="flex flex-1">
        <Sidebar2 />

        <main className="flex-1 p-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6 text-brown-800">
            Face Verification
          </h1>

          {/* STUDENT ID */}
          <div className="w-full max-w-sm mb-6">
            <input
              type="text"
              placeholder="Enter Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-3"
            />

            <button
              onClick={fetchVerifyContext}
              disabled={!studentId || loadingContext}
              className="w-full px-4 py-2 bg-blue-700 text-white rounded-md disabled:opacity-50"
            >
              {loadingContext ? "Checking..." : "Load Verification Context"}
            </button>
          </div>

          {/* STATUS */}
          <p className="mb-2 text-gray-700">
            Time Left: <b>{timeLeft}s</b>
          </p>
          <p className="mb-4 text-sm text-gray-600">
            Matches: {greenMatches} | Mismatches: {redMismatches}
          </p>

          {/* CAMERA */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  style={{
    width: "640px",
    height: "480px",
    objectFit: "contain",
    backgroundColor: "black"
  }}
/>
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0"
            />
          </div>

          {/* CONTROLS */}
          <div className="mt-6 flex gap-4">
            {!cameraOn ? (
              <button
                onClick={openCamera}
                disabled={!contextReady}
                className="px-6 py-3 bg-green-700 text-white rounded-md disabled:opacity-50"
              >
                Open Camera
              </button>
            ) : (
              <button
                onClick={closeCamera}
                className="px-6 py-3 bg-red-700 text-white rounded-md"
              >
                Close Camera
              </button>
            )}
          </div>

          {/* FEEDBACK */}
          <div className="mt-4 text-sm">
            {faceState === "DETECTING" && "🟡 Detecting face…"}
            {faceState === "MATCH" && "🟢 Face matched"}
            {faceState === "MISMATCH" && "🔴 Face mismatch"}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
