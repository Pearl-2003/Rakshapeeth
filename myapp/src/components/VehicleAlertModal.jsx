import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function VehicleAlertModal({
  open,
  onClose,
  vehicleNo,
  alertType,
  reason,
  guardId,
  gateId,
  gateName
}) {
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const sendAlert = async () => {
    setSending(true);

    try {
      await axios.post("http://localhost:5000/api/vehicle-alerts", {
        vehicleNo,
        alertType,
        reason,
        guardId,
        gateId,
        gateName
      });

      Swal.fire({
        icon: "success",
        title: "Alert sent to Admin 🚨",
        text: "Vehicle incident has been reported",
        timer: 1800,
        showConfirmButton: false
      });

      onClose();
    } catch (err) {
      Swal.fire("Error", "Failed to send vehicle alert", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-[520px] rounded-3xl shadow-2xl p-8"
      >
        <h2 className="text-2xl font-extrabold text-red-600 mb-2">
          🚗 Vehicle Security Alert
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          This alert will be sent directly to admin
        </p>

        <div className="space-y-4">
          <div>
            <span className="text-xs text-gray-500">Vehicle Number</span>
            <div className="font-semibold text-lg">{vehicleNo}</div>
          </div>

          <div>
            <span className="text-xs text-gray-500">Alert Type</span>
            <div className="font-semibold text-red-500">{alertType}</div>
          </div>

          <div>
            <span className="text-xs text-gray-500">Reason</span>
            <div className="text-sm">{reason}</div>
          </div>

          <textarea
            placeholder="Optional note for admin"
            className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-400 outline-none"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border"
          >
            Cancel
          </button>

          <button
            onClick={sendAlert}
            disabled={sending}
            className="px-6 py-2 rounded-xl bg-red-600 text-white font-semibold hover:scale-105 transition"
          >
            {sending ? "Sending..." : "Send Alert"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
