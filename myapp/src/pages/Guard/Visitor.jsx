import React, { useEffect, useState } from "react";
import HeaderNavbar from "../../components/HeaderNavbar3";
import Sidebar2 from "../../components/Sidebar2";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
export default function TodayVisitors() {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [visitorType, setVisitorType] = useState("");

  // 🔹 Fetch today's visitors
  const fetchVisitors = async () => {
    try {
      let query = [];
      if (search) query.push(`search=${search}`);
      if (visitorType) query.push(`visitorType=${visitorType}`);

      const qs = query.length ? `?${query.join("&")}` : "";
      const res = await fetch(
        `http://localhost:5000/api/guard/today-visitors${qs}`
      );
      const data = await res.json();
      setVisitors(data);
    } catch (err) {
      console.error("Visitor fetch error:", err);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [search, visitorType]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f1] to-[#f3eae3] flex flex-col">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1">
        <Sidebar2 sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-8 md:p-12">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-brown-800">
              {t("todaysVisitors")}
            </h1>
            <p className="text-gray-600 mt-2">
              {t("todayVisitorsSubtitle")}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder={t("searchVisitors")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-full border border-brown-300 focus:ring-2 focus:ring-brown-500 outline-none"
            />

            <select
              value={visitorType}
              onChange={(e) => setVisitorType(e.target.value)}
              className="px-6 py-3 rounded-full border border-brown-300 bg-[#f9f4ef] focus:outline-none"
            >
              <option value="">{t("allVisitors")}</option>
              <option value="Parent">{t("parent")}</option>
              <option value="Non-Parent">{t("nonParent")}</option>
            </select>
          </div>

          {/* Visitor Cards */}
          {visitors.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              {t("noVisitorsToday")}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {visitors.map((v) => (
                <div
                  key={v._id}
                  className="bg-white rounded-2xl shadow-xl p-6 hover:scale-[1.02] transition-transform"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-brown-800">
                      {v.visitorName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        v.visitorType === "Parent"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {t(v.visitorType)}
                    </span>
                  </div>

                  <div className="space-y-2 text-gray-700 text-sm">
                    <p>
                      <span className="font-semibold">{t("phone")}:</span>{" "}
                      {v.phoneNumber}
                    </p>
                    <p>
                      <span className="font-semibold">{t("vehicle")}:</span>{" "}
                      {v.vehicleNo || "—"}
                    </p>
                    <p>
                      <span className="font-semibold">{t("companions")}:</span>{" "}
                      {v.noOfCompanions}
                    </p>
                    <p>
                      <span className="font-semibold">{t("reason")}:</span>{" "}
                      {v.reason}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-brown-700 text-white rounded-md hover:bg-brown-800">
                     {t("allowEntry")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
