import React, { useState, useEffect } from "react";
import gateImg from "../assets/gate.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import SecureEntryVideo from "../assets/Secure_Entry_Demo.mp4";
import NotifyVideo from "../assets/Notify.mp4"; 
import VehicleVideo from "../assets/veh.mp4";
import { useTranslation } from "react-i18next";
export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detect clicks outside the sidebar to close it
  useEffect(() => {
    function handleClickOutside(event) {
      const sidebar = document.getElementById("sidebar");
      if (sidebarOpen && sidebar && !sidebar.contains(event.target)) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="font-sans bg-gradient-to-b from-cream to-cream/90 relative">
      {/* Header + Navbar */}
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} id="sidebar" />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Hero / Gate Image */}
      <div
        className="w-full h-[680px] bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{ backgroundImage: `url(${gateImg})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Main Content */}
      <main className="p-10 md:p-20 text-brown">
        {/* Welcome Card */}
        <div className="bg-cream rounded-3xl shadow-2xl p-10 text-center space-y-6 mt-10 transform hover:scale-105 transition-transform duration-500">
          <h1 className="text-5xl md:text-6xl font-extrabold">{t("homeWelcome")}</h1>
          <p className="text-xl md:text-2xl">
            {t("homeSubtitle")}
          </p>
          <Link to="/login">
          <button className="px-8 py-4 bg-gradient-to-r from-brown to-brown/80 text-cream rounded-full font-semibold hover:scale-105 hover:shadow-xl transition-all duration-500">
            {t("getStarted")}
          </button>
          </Link>
        </div>

        {/* Features / Info Cards */}
        <div className="mt-16 grid md:grid-cols-3 gap-10">
          {[
              {
                title: t("secureEntryTitle"),
                desc: t("secureEntryDesc"),
                icon: "🔒",
                link: "/secure-entry"
              },
              {
                title: t("smartNotifTitle"),
                desc: t("smartNotifDesc"),
                icon: "📲",
                link: "/notify"
              },
              {
                title: t("vehicleMgmtTitle"),
                desc: t("vehicleMgmtDesc"),
                icon: "🚗",
                link: "/vehicle"
              }
            ].map((feature, idx) => (
            <div
              key={idx}
              onClick={() => feature.link && navigate(feature.link)}
              className="cursor-pointer bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-500 text-center"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{feature.title}</h2>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
