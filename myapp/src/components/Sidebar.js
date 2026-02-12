// src/components/Sidebar.js
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
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
          Menu
        </h2>
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-3xl font-bold text-cream hover:text-yellow-300 transition-transform transform hover:rotate-90"
        >
          ✕
        </button>
      </div>

      <nav className="flex flex-col space-y-2">
        {/* Register Dropdown */}
        <div className="flex flex-col" ref={registerRef}>
          <button
            onClick={() => setRegisterOpen(!registerOpen)}
            className="flex items-center justify-between w-full px-3 py-3 rounded-xl hover:bg-cream/20 hover:text-brown transition-all duration-300 shadow-inner hover:shadow-lg hover:scale-105"
          >
            <span className="font-semibold text-lg">📝 Register</span>
            <span
              className={`ml-2 transform transition-transform duration-300 ${
                registerOpen ? "rotate-180" : "rotate-0"
              }`}
            >
              ▾
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              registerOpen ? "max-h-40 mt-1" : "max-h-0"
            }`}
          >
            <Link
              to="/guard-registration"
              className="flex items-center px-6 py-2 rounded-xl hover:bg-cream/20 hover:text-brown transition-all duration-300"
            >
              <span>🛡️</span>
              <span className="ml-2">Guard</span>
            </Link>
            <Link
              to="/parent-registration"
              className="flex items-center px-6 py-2 rounded-xl hover:bg-cream/20 hover:text-brown transition-all duration-300"
            >
              <span>👨‍👩‍👧</span>
              <span className="ml-2">Parent</span>
            </Link>
          </div>
        </div>

        {/* Sidebar Links */}
        {[
          { name: "Login", icon: "🔐", path: "/login" },
          { name: "Pre-Visit Form", icon: "📝", path: "/pre-visit" },
          { name: "Feedback", icon: "💬", path: "/feedback" }
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
