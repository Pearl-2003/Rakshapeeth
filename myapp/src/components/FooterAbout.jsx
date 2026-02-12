// src/components/FooterAbout.js
import React from "react";

export default function FooterAbout({ language = "en", quickLinks, connect }) {
  const labels = {
    en: { quickLinks: "Quick Links", connect: "Connect" },
    hi: { quickLinks: "त्वरित लिंक", connect: "संपर्क करें" },
  };

  return (
    <footer className="bg-gradient-to-r from-brown to-brown/90 text-cream mt-16 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-cream/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cream/10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 relative z-10">
        {/* Branding */}
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold tracking-wide">RAKSHAPEETH</h2>
          <p className="text-cream/80">
            {language === "en"
              ? "Automated Gate Security System for Banasthali Vidyapith."
              : "वनस्थली विद्यापीठ के लिए स्वचालित गेट सुरक्षा प्रणाली।"}
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{labels[language].quickLinks}</h3>
          <ul className="space-y-1">
            {quickLinks?.map((link, idx) => (
              <li key={idx}>
                <a href="#" className="hover:text-yellow-300 transition-all duration-300">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{labels[language].connect}</h3>
          <p>{connect?.email}</p>
          <p>{connect?.phone}</p>
          <div className="flex space-x-4 mt-3">
            <a href="#" className="p-2 bg-cream/20 rounded-full hover:bg-cream/50 text-brown shadow-lg transition-all duration-300 hover:scale-110">🐦</a>
            <a href="#" className="p-2 bg-cream/20 rounded-full hover:bg-cream/50 text-brown shadow-lg transition-all duration-300 hover:scale-110">🔗</a>
            <a href="#" className="p-2 bg-cream/20 rounded-full hover:bg-cream/50 text-brown shadow-lg transition-all duration-300 hover:scale-110">📘</a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/40 mt-6 py-4 text-center text-cream/70 relative z-10">
        © {new Date().getFullYear()} RAKSHAPEETH. All rights reserved.
      </div>
    </footer>
  );
}