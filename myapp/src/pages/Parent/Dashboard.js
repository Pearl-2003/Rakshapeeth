import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ ADD THIS
import Sidebar from "../../components/Sidebar3";
import HeaderNavbar from "../../components/HeaderNavbar4";
import Footer from "../../components/Footer";
import { CalendarPlus, Calendar, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
export default function ParentDashboard() {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f1] to-[#f3eae3] flex flex-col">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Dashboard Content */}
        <main className="flex-1 p-12 text-gray-800 flex flex-col justify-center items-center">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-[#7B4B2A] tracking-wide drop-shadow-sm text-center">
            {t("welcomeParent")}
          </h1>

          <p className="text-center text-lg text-[#8b5e34] mb-14 max-w-3xl">
            {t("parentDashboardSubtitle")}
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-14 w-full max-w-[1600px] px-6">

            {/* 🔗 REQUEST A VISIT — LINKED */}
            <Link
              to="/parent-visit-request"
              className="flex-1 min-w-[400px] h-[400px]"
            >
              <div className="bg-white hover:bg-[#f9f3ed] shadow-2xl rounded-3xl p-16 h-full text-center border border-[#e6d5c3] transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="flex justify-center mb-6">
                  <CalendarPlus size={70} className="text-[#6b4226]" />
                </div>
                <h2 className="text-3xl font-semibold text-[#6b4226] mb-4">
                  {t("requestVisit")}
                </h2>
                <p className="text-lg text-[#7b5e3b]">
                  {t("requestVisitDesc")}
                </p>
              </div>
            </Link>

            {/* VISIT HISTORY */}
             <Link
              to="/parent/view-history"
              className="flex-1 min-w-[400px] h-[400px]"
            >
            <div className="bg-white hover:bg-[#f9f3ed] shadow-2xl rounded-3xl p-16 flex-1 min-w-[400px] h-[400px] text-center border border-[#e6d5c3] transition-all duration-300 transform hover:scale-105">
              <div className="flex justify-center mb-6">
                <Calendar size={70} className="text-[#6b4226]" />
              </div>
              <h2 className="text-3xl font-semibold text-[#6b4226] mb-4">
                {t("visitHistory")}
              </h2>
              <p className="text-lg text-[#7b5e3b]">
                {t("visitHistoryDesc")}
              </p>
            </div>
            </Link> 

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
