// src/components/GuardVehicleNotifications.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

export default function GuardVehicleNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const guardId = localStorage.getItem("guardId");

  useEffect(() => {
    if (!guardId) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/vehicle-alerts/notifications/guard/${guardId}`
        );

        // 🔥 BACKEND MATCHING FILTER (THIS IS KEY)
        const vehicleAlerts = res.data.filter(
          n =>
            n.alertType === "MANUAL_REQUIRED" ||
            n.alertType === "BLACKLISTED"
        );

        setNotifications(vehicleAlerts);
      } catch (err) {
        console.error("Vehicle notification fetch failed", err);
      }
    };

    fetchNotifications();
  }, [guardId]);

  // 🔕 Nothing to show
  if (notifications.length === 0) return null;

  const markSeen = async (id) => {
    await axios.post(
      `http://localhost:5000/api/vehicle-alerts/notifications/${id}/seen`
    );
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-20 right-8 z-[4000] pointer-events-none">
      {/* 🔔 Bell */}
      <button
  onClick={() => setOpen(!open)}
  className="relative bg-white p-3 rounded-full shadow-xl hover:scale-110 transition pointer-events-auto"
>
        <Bell className="w-6 h-6 text-[#7B4B2A]" />
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 rounded-full">
          {notifications.length}
        </span>
      </button>

      {/* 🔽 Dropdown */}
      {open && (
        <div className="mt-4 w-96 bg-white rounded-2xl shadow-2xl p-4 space-y-3 pointer-events-auto">
          <h4 className="font-bold text-lg text-[#5C3A21]">
            🚗 Vehicle Alerts
          </h4>

          {notifications.map(n => (
            <div
              key={n.id}
              className="border rounded-xl p-3 flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">
                  {n.alertType === "BLACKLISTED"
                    ? "🚨 Blacklisted Vehicle"
                    : "⚠️ Manual Entry Required"}
                </p>
                <p className="text-sm text-gray-600">
                  Vehicle: {n.vehicleNo}
                </p>
                <p className="text-sm text-[#7B4B2A] mt-1">
                        {n.message}
                      </p>
                <p className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => markSeen(n.id)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}