import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import HeaderNavbar from "../../components/HeaderNavbar4";
import Sidebar from "../../components/Sidebar3";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
export default function ParentDashboard() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("children");
  const [children, setChildren] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("parentToken");

  /* ================= FETCH CHILDREN STATUS ================= */
  useEffect(() => {
    if (activeTab !== "children") return;

    const fetchChildren = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:5000/api/parent/children/status",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await res.json();
        setChildren(data.children || []);
      } catch (err) {
        Swal.fire(t("error"), t("unableToLoadChildren"), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [activeTab, token]);

  /* ================= FETCH HISTORY ================= */
  const loadHistory = async (student) => {
    try {
      setLoading(true);
      setSelectedStudent(student);

      const res = await fetch(
        `http://localhost:5000/api/parent/history/${student.student_id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      setHistory(data.history || []);
      setActiveTab("history");
    } catch {
      Swal.fire(t("error"), t("unableToLoadHistory"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-cream to-cream/90 flex flex-col">

      {/* HEADER + SIDEBAR */}
      <HeaderNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN */}
      <main className="flex-grow flex justify-center px-6 py-24 text-brown">
        <div className="relative w-full max-w-5xl bg-cream/80 backdrop-blur-2xl rounded-[2.5rem]
          shadow-[0_30px_80px_rgba(0,0,0,0.18)] px-10 py-12">

          {/* Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brown/20 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brown/20 rounded-full blur-[120px]"></div>

          {/* HEADING */}
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-4xl font-extrabold text-brown">
              {t("parentDashboard")}
            </h2>
            <p className="text-brown/70 mt-2">
              {t("monitorChildActivity")}
            </p>
          </div>

          {/* TABS */}
          <div className="flex justify-center mb-12 relative z-10">
            <div className="bg-white/70 backdrop-blur-xl rounded-full flex shadow-inner p-1">
              <button
                onClick={() => setActiveTab("children")}
                className={`px-8 py-3 rounded-full font-semibold transition-all
                  ${activeTab === "children"
                    ? "bg-brown text-cream shadow-lg"
                    : "text-brown hover:bg-brown/10"}`}
              >
                {t("myChildren")}
              </button>

              <button
                onClick={() => setActiveTab("history")}
                disabled={!selectedStudent}
                className={`px-8 py-3 rounded-full font-semibold transition-all
                  ${activeTab === "history"
                    ? "bg-brown text-cream shadow-lg"
                    : "text-brown hover:bg-brown/10 disabled:opacity-40"}`}
              >
                {t("history")}
              </button>
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="relative z-10">

            {/* CHILDREN STATUS */}
            {activeTab === "children" && (
              <div className="grid md:grid-cols-2 gap-8">
                {children.map((c) => (
                  <div
                    key={c.student_id}
                    className="bg-white/90 rounded-3xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer"
                    onClick={() => loadHistory(c)}
                  >
                    <h3 className="text-xl font-bold text-brown">
                      {c.name}
                    </h3>

                    <p className="mt-2 text-sm">
                      {t("status")}:
                      <span className={`ml-2 font-semibold
                        ${c.currentStatus === "inside"
                          ? "text-green-700"
                          : "text-red-700"}`}>
                        {c.currentStatus?.toUpperCase()}
                      </span>
                    </p>

                    <p className="text-sm mt-1">
                      {t("lastEntry")}: {c.lastEntry || "—"}
                    </p>
                    <p className="text-sm">
                      {t("lastExit")}: {c.lastExit || "—"}
                    </p>
                  </div>
                ))}

                {!loading && children.length === 0 && (
                  <p className="text-center col-span-2 text-brown/70">
                    {t("noChildrenLinked")}
                  </p>
                )}
              </div>
            )}

            {/* HISTORY */}
            {activeTab === "history" && (
  <div className="bg-white/90 rounded-3xl p-8 shadow-lg">

    {!selectedStudent && (
      <p className="text-center text-brown/70 text-lg">
       {t("selectStudentForHistory")}
      </p>
    )}

    {selectedStudent && (
      <>
        <h3 className="text-2xl font-bold text-brown mb-8">
          {selectedStudent.name} — {t("detailedHistory")}
        </h3>

        <div className="space-y-6">
          {history.map((h, i) => {
            // Duration calculation (safe)
            let duration = "—";
            if (h.entryTime && h.exitTime) {
              const start = new Date(`1970-01-01T${h.entryTime}:00`);
              const end = new Date(`1970-01-01T${h.exitTime}:00`);
              const diffMs = end - start;
              if (diffMs > 0) {
                const hrs = Math.floor(diffMs / (1000 * 60 * 60));
                const mins = Math.floor((diffMs / (1000 * 60)) % 60);
                duration = `${hrs} hrs ${mins} mins`;
              }
            }

            return (
              <div
                key={i}
                className="bg-cream/70 border border-brown/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-brown text-lg">
                    📅 {h.entryDate}
                  </span>

                  {h.exitTime ? (
                    <span className="text-red-700 font-semibold">
                      {t("exited")}
                    </span>
                  ) : (
                    <span className="text-green-700 font-semibold">
                      {t("currentlyInside")}
                    </span>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-brown">
                  <p>
                    🟢 <b>{t("entryTime")}:</b> {h.entryTime || "—"}
                  </p>
                  <p>
                    🔴 <b>{t("exitTime")}:</b> {h.exitTime || t("notExitedYet")}
                  </p>
                  <p>
                    ⏳ <b>{t("durationInside")}:</b> {duration}
                  </p>
                  <p>
                    🏫 <b>{t("status")}:</b>{" "}
                    {h.exitTime
                      ? t("studentExited")
                      : t("studentInside")}
                  </p>
                </div>
              </div>
            );
          })}

          {history.length === 0 && (
            <p className="text-center text-brown/60">
              {t("noHistoryAvailable")}
            </p>
          )}
        </div>
      </>
    )}
  </div>
)}


          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
