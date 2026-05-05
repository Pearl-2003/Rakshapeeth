import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function Sidebar2({ sidebarOpen, setSidebarOpen }) {
  const { t } = useTranslation();
  const [registerOpen, setRegisterOpen] = useState(false);
  const registerRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (registerRef.current && !registerRef.current.contains(event.target)) {
        setRegisterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-brown/90 to-brown/90 backdrop-blur-lg text-white shadow-2xl p-6 space-y-4 transform transition-transform duration-500 z-50 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold tracking-wide text-cream drop-shadow-lg">
          <h2>{t("menu")}</h2>
        </h2>
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-3xl font-bold text-cream hover:text-yellow-300 transition-transform transform hover:rotate-90"
        >
          ✕
        </button>
      </div>

      <nav className="flex flex-col space-y-2">
        {/* Sidebar Links */}
        {[
            { name: t("visitRequest"), path: "/parent-visit-request" },
            { name: t("viewWardHistory"), path: "/parent/view-history" },
          ].map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-cream/20 hover:text-brown transition-all duration-300 shadow-inner hover:shadow-lg hover:scale-105 group relative"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-semibold">{item.name}</span>
            <span className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-white/30 opacity-0 group-hover:opacity-30 animate-shine rounded-xl pointer-events-none"></span>
          </Link>
        ))}
      </nav>
    </div>
  );
}