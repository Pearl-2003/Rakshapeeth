// src/pages/Guard/VehicleNumberPlate.jsx
import { useState } from "react";
import VehicleAlertModal from "../../components/VehicleAlertModal";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
export default function VerifyNumberPlate() {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [detectedPlate, setDetectedPlate] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
const [alertData, setAlertData] = useState(null);
  const SCAN_URL = "http://localhost:8000/scan_plate";
  const BACKEND_URL = "http://localhost:5000/api/vehicle/process";
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
      Swal.fire(
        t("missingImage"),
        t("uploadVehicleImageRequired"),
        "warning"
      );
      return;
    }

    setLoading(true);
    setDetectedPlate("");
    setStatus("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("vehicle_type", "four");

      const res = await fetch(SCAN_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setLoading(false);
      if (!data.plate) {
        Swal.fire(
          t("notDetected"),
          t("retryScan"),
          "warning"
        );
        return;
      }

      setDetectedPlate(data.plate);

const backendResult = await callBackendDecision(
  data.plate,
  data.confidence || 0.9
);

setStatus(t(backendResult.status));
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
  setAlertData(null);   // 🔥 IMPORTANT
}



     } catch (error) {
  setLoading(false);
  Swal.fire(
    t("error"),
    t("serverErrorRetry"),
    "error"
  );
  setStatus("ERROR");
  setMessage(t("serverErrorRetry"));
}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7eddc] via-[#f3e5cf] to-[#efe0c6] text-[#5C3A21]">

      <main className="flex justify-center items-center px-6 py-20">
        <div className="bg-[#fffaf4] rounded-[2.5rem] shadow-[0_25px_70px_rgba(123,75,42,0.25)] border border-[#7B4B2A]/30 w-full max-w-2xl p-12">

          <h2 className="text-3xl font-extrabold text-center">
            {t("vehicleVerification")}
          </h2>

          <p className="text-center opacity-80 mb-10">
            {t("agssTitle")}
          </p>

          <label className="block text-sm font-semibold mb-2">
            {t("uploadVehicleImage")}
          </label>

          <div className="flex items-center gap-3">
  <button
    type="button"
    onClick={() => document.getElementById("vehicleUpload").click()}
    className="px-4 py-2 border rounded bg-gray-200 text-black"
  >
    {t("chooseFile")}
  </button>

  <span className="text-sm text-gray-600">
    {image ? image.name : t("noFileChosen")}
  </span>

  <input
    id="vehicleUpload"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => setImage(e.target.files[0])}
  />
</div>

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
            {t("scanNumberPlate")}
          </button>

          {loading && (
  <p className="text-center mt-6">
    {t("processingImage")}
  </p>
)}

          {detectedPlate && (
            <div className="mt-6 text-center bg-[#f3e5cf] py-4 rounded-2xl">
              <p className="text-sm opacity-70">{t("detectedPlate")}</p>
              <p className="text-2xl font-extrabold tracking-widest">
                {detectedPlate}
              </p>
            </div>
          )}
          {alertData && (
  <div className="mt-6 flex justify-center">
    <button
      onClick={() => setAlertOpen(true)}
      className="px-8 py-3 rounded-xl bg-red-600 text-white font-bold
                 hover:scale-105 transition shadow-lg"
    >
      {t("sendAlertAdmin")}
    </button>
  </div>
)}


          {status && (
            <div className="mt-6 text-center">
              <p
                className={`text-xl font-bold ${
                  status === "ALLOWED" ? "text-green-700" : "text-red-700"
                }`}
              >
                {status}
              </p>
              <p className="mt-2 text-sm opacity-80">{message}</p>

              {status !== "ALLOWED" && (
                <p className="mt-4 text-sm italic opacity-70">
                  {t("manualVerificationHint")}
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