// src/components/Sidebar.js (ADMIN VERSION - SCROLL WITHOUT VISIBLE BAR)
import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-96 bg-gradient-to-b from-brown/95 to-brown/95 backdrop-blur-lg text-white shadow-2xl p-6 space-y-4 transform transition-transform duration-500 z-50 overflow-y-scroll no-scrollbar ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold tracking-wide text-cream drop-shadow-lg">
          Admin Menu
        </h2>
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-3xl font-bold text-cream hover:text-yellow-300 transition-transform transform hover:rotate-90"
        >
          ✕
        </button>
      </div>

      <nav className="flex flex-col space-y-2">
        {[
          { name: "Handle Requests", icon: "✅", path: "/admin/requests" },
          { name: "Manage Blacklist", icon: "🚫", path: "/admin/blacklist" },
          { name: "Manage Whitelist", icon: "✅", path: "/admin/whitelist" },
          { name: "Manage Occasional Visitors", icon: "👥", path: "/admin/occasional-visitors" },
          { name: "Manage Students", icon: "🎓", path: "/admin/students" },
          { name: "Manage Guard", icon: "🛡️", path: "/admin/guards" },
          { name: "Gatepass", icon: "⏳", path: "/admin/create-gatepass" },
          { name: "Active Gatepasses", icon: "⏳", path: "/admin/active-gatepasses" },
          { name: "Campus Activity", icon: "📊", path: "/admin/system-activity" },
          { name: "Alerts", icon: "🚨", path: "/admin/alerts" },
          { name: "Monitor Guards", icon: "🛡️", path: "/admin/monitor-guard" },
          { name: "View Student Logs", icon: "📄", path: "/admin/view-student-log" },
          { name: "View Vehicle Logs", icon: "🚗", path: "/admin/vehicle-logs" },
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
