//src/pages/Guard/VehicleVerification.jsx
import { useState } from "react";
import HeaderNavbar from "../../components/HeaderNavbar3";
import Sidebar from "../../components/Sidebar2";
import Footer from "../../components/Footer";
import GuardVehicleNotifications from "../../components/GuardVehicleNotifications";

import VerifyNumberPlate from "./VehicleNumberPlate";
import VerifyTwoWheelerPlate from "./VerifyBikePlate";

export default function VehicleVerification() {
  const [activeTab, setActiveTab] = useState("four");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7eddc] via-[#f3e5cf] to-[#efe0c6] text-[#5C3A21]">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🔹 TAB BAR */}
      <div className="flex justify-center mt-28">
        <div className="flex bg-[#fffaf4] rounded-full shadow-lg border border-[#7B4B2A]/30 overflow-hidden">

          <button
            onClick={() => setActiveTab("four")}
            className={`px-8 py-3 font-bold transition-all duration-300 ${
              activeTab === "four"
                ? "bg-[#7B4B2A] text-white"
                : "text-[#5C3A21] hover:bg-[#f3e5cf]"
            }`}
          >
            🚗 Four Wheeler
          </button>

          <button
            onClick={() => setActiveTab("two")}
            className={`px-8 py-3 font-bold transition-all duration-300 ${
              activeTab === "two"
                ? "bg-[#7B4B2A] text-white"
                : "text-[#5C3A21] hover:bg-[#f3e5cf]"
            }`}
          >
            🏍 Two Wheeler
          </button>

        </div>
      </div>

      {/* 🔹 TAB CONTENT */}
      <div className="mt-6">
        {activeTab === "four" && <VerifyNumberPlate />}
        {activeTab === "two" && <VerifyTwoWheelerPlate />}
      </div>

      <GuardVehicleNotifications />

      <Footer />
    </div>
  );
}
