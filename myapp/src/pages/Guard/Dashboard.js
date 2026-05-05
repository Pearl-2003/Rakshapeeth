import React, { useState, useEffect } from "react";
import axios from "axios"; // ✅ import axios
import HeaderNavbar from "../../components/HeaderNavbar3";
import Sidebar2 from "../../components/Sidebar2";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function Dashboard() {
  // ✅ Hooks must be here
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expectedVisitors, setExpectedVisitors] = useState(0);
  const navigate = useNavigate();

  // Live Clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch expected visitors
  useEffect(() => {
    const fetchExpectedVisitors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboardExpectedVisitor/expected-today");

        setExpectedVisitors(res.data.expectedVisitors);
      } catch (error) {
        console.error("Failed to fetch expected visitors:", error);
      }
    };

    fetchExpectedVisitors();
  }, []);

    const quickActions = [
    {
      title: t("manualEntryTitle"),
      desc: t("manualEntryDesc"),
      btn: t("manualEntryBtn"),
      path: "/guard/manual-entry",
    },
    {
      title: t("irisScanTitle"),
      desc: t("irisScanDesc"),
      btn: t("irisScanBtn"),
      path: "/guard/verify-iris",
    },
    {
      title: t("plateScanTitle"),
      desc: t("plateScanDesc"),
      btn: t("plateScanBtn"),
      path: "/guard/vehicle-verification",
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5f1] via-[#f3eae3] to-[#efe3da] flex flex-col text-[#3e2c23]">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1">
        <Sidebar2 sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-8 md:p-12 space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">{t("guardDashboardTitle")}</h1>
              <p className="text-gray-600 mt-2">{t("guardDashboardSubtitle")}</p>
            </div>
            <div className="mt-4 md:mt-0 bg-white/70 backdrop-blur-md px-6 py-3 rounded-xl shadow-md">
              <p className="text-sm text-gray-500">{t("currentTime")}</p>
              <p className="font-semibold text-lg">{currentTime.toLocaleTimeString()}</p>
            </div>
          </div>

          {/* Expected Visitors Card */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-3xl shadow-2xl p-10 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#7B4B2A]/10 rounded-full blur-3xl"></div>
            <h2 className="text-lg text-gray-600 mb-3">{t("expectedVisitorsToday")}</h2>
            <p className="text-6xl font-bold text-[#7B4B2A]">{expectedVisitors}</p>
            <p className="mt-3 text-sm text-gray-500">{t("expectedVisitorsNote")}</p>
          </motion.div>

          {/* Quick Actions */} 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickActions.map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#7B4B2A]/5 rounded-full blur-2xl"></div>
                <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                <p className="text-gray-600 mb-6 text-sm">{card.desc}</p>
                <button
                  onClick={() => navigate(card.path)}
                  className="px-5 py-2 bg-[#7B4B2A] text-white rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all"
                >
                  {card.btn}
                </button>
              </motion.div>
            ))}
          </div>

        </main>
      </div>
      <Footer />
    </div>
  );
}