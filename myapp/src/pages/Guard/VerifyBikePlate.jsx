// src/pages/Guard/VerifyBikePlate.jsx
import { useState } from "react";
import VehicleAlertModal from "../../components/VehicleAlertModal";


export default function VerifyTwoWheelerPlate() {
  const [image, setImage] = useState(null);
  const [detectedPlate, setDetectedPlate] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
const [alertData, setAlertData] = useState(null);

  const SCAN_URL = "http://localhost:8000/scan_plate";
  const BACKEND_URL = "http://localhost:5000/api/vehicle/process";

  // 🔑 Backend decision call (ENTRY / EXIT / MANUAL_REQUIRED)
  const callBackendDecision = async (plate, confidence) => {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        vehicleNo: plate,
        scanSource: "ANPR",
        confidence
      })
    });

    return res.json();
  };

  const handleScan = async () => {
    setAlertOpen(false);
setAlertData(null);

    if (!image) {
      alert("Please upload a vehicle image");
      return;
    }

    setLoading(true);
    setDetectedPlate("");
    setStatus("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("vehicle_type", "two"); // ✅ TWO WHEELER

      const res = await fetch(SCAN_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (!data.plate) {
        setStatus("NOT DETECTED");
        setMessage("Retry scan or enter manually");
        return;
      }

      setDetectedPlate(data.plate);

      // 🔑 FINAL BACKEND DECISION
      const backendResult = await callBackendDecision(
        data.plate,
        data.confidence || 0.9
      );

      setStatus(backendResult.status);
      setMessage(backendResult.message);
      if (
  backendResult.status === "DENIED" ||
  backendResult.status === "MANUAL_REQUIRED"
) {
  setAlertData({
    vehicleNo: data.plate,
    alertType:
      backendResult.status === "DENIED"
        ? "BLACKLISTED"
        : "MANUAL_REQUIRED",
    reason: backendResult.message
  });
} else {
  setAlertData(null);
}


    } catch {
      setLoading(false);
      setStatus("ERROR");
      setMessage("Server error — try again");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7eddc] via-[#f3e5cf] to-[#efe0c6] text-[#5C3A21]">

      <main className="flex justify-center items-center px-6 py-20">
        <div className="bg-[#fffaf4] rounded-[2.5rem] shadow-[0_25px_70px_rgba(123,75,42,0.25)] border border-[#7B4B2A]/30 w-full max-w-2xl p-12">

          <h2 className="text-3xl font-extrabold text-center">
            Two Wheeler Number Plate Verification
          </h2>

          <p className="text-center opacity-80 mb-10">
            Automated Gate Security System – AGSS-BV
          </p>

          <label className="block text-sm font-semibold mb-2">
            Upload Vehicle Image
          </label>

          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full mt-6 rounded-2xl border"
            />
          )}

          <button
            onClick={handleScan}
            className="w-full mt-8 bg-gradient-to-r from-[#7B4B2A] to-[#5C3A21] text-white py-4 rounded-2xl font-bold text-lg"
          >
            Scan Number Plate
          </button>

          {loading && (
            <p className="text-center mt-6">Processing image…</p>
          )}

          {detectedPlate && (
            <div className="mt-6 text-center bg-[#f3e5cf] py-4 rounded-2xl">
              <p className="text-sm opacity-70">Detected Plate</p>
              <p className="text-2xl font-extrabold tracking-widest">
                {detectedPlate}
              </p>
            </div>
          )}

          {status && (
            <div className="mt-6 text-center">
              <p
                className={`text-xl font-bold ${
                  status === "ALLOWED"
                    ? "text-green-700"
                    : status === "DENIED"
                    ? "text-red-700"
                    : "text-yellow-700"
                }`}
              >
                {status}
              </p>
              <p className="mt-2 text-sm opacity-80">{message}</p>
                {alertData && (
  <button
    onClick={() => setAlertOpen(true)}
    className="mt-6 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:scale-105 transition"
  >
    🚨 Send Alert to Admin
  </button>
)}

              {status !== "ALLOWED" && (
                <p className="mt-4 text-sm italic opacity-70">
                  Please retry scan or proceed with manual verification
                </p>
              )}
            </div>
          )}

        </div>
      </main>
          <VehicleAlertModal
  open={alertOpen}
  onClose={() => setAlertOpen(false)}
  vehicleNo={alertData?.vehicleNo}
  alertType={alertData?.alertType}
  reason={alertData?.reason}
  guardId={localStorage.getItem("guardId")}
  gateId="GATE-2"
  gateName="Main Gate"
/>

    </div>
  );
}