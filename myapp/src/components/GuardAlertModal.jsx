import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const GuardAlertModal = ({
  open,
  onClose,
  student,
  reason,
  alertType,
  guard
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  /* ================= CAMERA HANDLING ================= */

  useEffect(() => {
    if (open) {
      startCamera();
    }

    return () => {
      stopCamera();
      setCapturedImage(null);
      setNote("");
    };
  }, [open]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      Swal.fire("Camera Error", "Camera access denied", "error");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  /* ================= CAPTURE IMAGE ================= */

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        setCapturedImage(blob);
        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  /* ================= SEND ALERT ================= */

  const sendAlert = async () => {
    if (!capturedImage) {
      Swal.fire("Missing Image", "Please capture image first", "warning");
      return;
    }

    setSending(true);

    try {
      const formData = new FormData();
      formData.append("image", capturedImage);
      formData.append("studentId", student.studentId);
      formData.append("studentName", student.studentName);
      formData.append("alertType", alertType);
      formData.append("reason", reason);
      formData.append("guardNote", note || "");
      formData.append("guardId", guard.id);
      formData.append("guardName", guard.name);

      await axios.post(
        "http://localhost:5000/api/security-alerts",
        formData
      );

      // 🌟 Modern success toast
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Alert sent to admin",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });

      onClose();
    } catch (err) {
      Swal.fire("Error", "Failed to send alert", "error");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  /* ================= UI ================= */

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "radial-gradient(circle at top, rgba(255,255,255,0.15), rgba(0,0,0,0.75))",
        backdropFilter: "blur(6px)",
        zIndex: 100000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.3s ease-out"
      }}
    >
      <div
        style={{
          width: "520px",
          maxWidth: "95%",
          background:
            "linear-gradient(135deg, #ffffff, #fff7f0)",
          borderRadius: "22px",
          padding: "26px",
          boxShadow:
            "0 25px 80px rgba(123, 75, 42, 0.45)",
          transform: "translateY(0)",
          animation: "slideUp 0.35s ease-out"
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px"
          }}
        >
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: "800",
              color: "#5C3A21"
            }}
          >
            🚨 Send Alert to Admin
          </h2>

          <button
            onClick={onClose}
            style={{
              fontSize: "1.3rem",
              background: "transparent",
              border: "none",
              cursor: "pointer"
            }}
          >
            ✖
          </button>
        </div>

        {/* CAMERA / IMAGE */}
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                borderRadius: "14px",
                border: "2px solid rgba(123,75,42,0.3)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
              }}
            />
            <button
              onClick={captureImage}
              style={{
                marginTop: "14px",
                width: "100%",
                padding: "14px",
                background:
                  "linear-gradient(to right, #7B4B2A, #5C3A21)",
                color: "#fff",
                borderRadius: "14px",
                fontWeight: "700",
                fontSize: "1rem",
                boxShadow: "0 8px 25px rgba(123,75,42,0.5)",
                cursor: "pointer"
              }}
            >
              📸 Capture Image
            </button>
          </>
        ) : (
          <img
            src={URL.createObjectURL(capturedImage)}
            alt="Captured"
            style={{
              width: "100%",
              borderRadius: "14px",
              border: "2px solid rgba(123,75,42,0.3)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
            }}
          />
        )}

        {/* NOTE */}
        <textarea
          placeholder="Optional note for admin…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            width: "100%",
            marginTop: "16px",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid rgba(123,75,42,0.3)",
            resize: "none",
            fontSize: "0.95rem"
          }}
        />

        {/* ACTIONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px"
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#eee",
              padding: "10px 18px",
              borderRadius: "12px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>

          <button
            onClick={sendAlert}
            disabled={sending}
            style={{
              background:
                "linear-gradient(to right, #7B4B2A, #5C3A21)",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "14px",
              fontWeight: "800",
              boxShadow: "0 8px 25px rgba(123,75,42,0.5)",
              cursor: "pointer"
            }}
          >
            {sending ? "Sending…" : "Send Alert"}
          </button>
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default GuardAlertModal;
