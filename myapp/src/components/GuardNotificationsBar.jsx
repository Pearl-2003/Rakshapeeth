import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

export default function GuardNotificationsBar({ guardId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const API_BASE = "http://localhost:5000/api/security-alerts";

  /* ================= FETCH UNSEEN NOTIFICATIONS ================= */
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/notifications/guard/${guardId}`
      );
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    if (guardId) fetchNotifications();

    // optional polling every 10s (modern feel)
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [guardId]);

  /* ================= DISMISS ================= */
  const dismissNotification = async (id) => {
    try {
      await axios.post(
        `${API_BASE}/notifications/${id}/seen`
      );
      setNotifications((prev) =>
        prev.filter((n) => n.id !== id)
      );
    } catch (err) {
      alert("Failed to dismiss notification");
    }
  };

  // 🔕 Nothing to show
  if (!notifications.length) return null;

  return (
    <div className="fixed top-24 right-6 z-50">

      {/* 🔔 Bell */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={() => setOpen(!open)}
        className="relative bg-[#7B4B2A] text-white p-4 rounded-full shadow-xl"
      >
        <Bell />
        <span className="absolute -top-1 -right-1 bg-red-600 text-xs
          w-5 h-5 rounded-full flex items-center justify-center">
          {notifications.length}
        </span>
      </motion.button>

      {/* 📜 Notification Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 w-96 bg-white rounded-2xl shadow-2xl
              border border-[#7B4B2A]/30 overflow-hidden"
          >
            <div className="p-4 font-bold text-[#5C3A21] border-b">
              Admin Messages
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 border-b hover:bg-[#f7eddc]/40 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-[#5C3A21]">
                        {n.alertType} Alert – {n.studentId}
                      </p>
                      <p className="text-sm text-[#7B4B2A] mt-1">
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => dismissNotification(n.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
