// src/components/Footer.js
import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {

  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-r from-brown to-brown/90 text-cream mt-16 relative overflow-hidden">
      
      {/* Decorative shapes */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-cream/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cream/10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 relative z-10">

        {/* About */}
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold tracking-wide">
            {t("footerBrand")}
          </h2>

          <p className="text-cream/80">
            {t("footerDescription")}
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">
            {t("quickLinks")}
          </h3>

          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-yellow-300 transition-all duration-300">
                {t("home")}
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-yellow-300 transition-all duration-300">
                {t("about")}
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-yellow-300 transition-all duration-300">
                {t("register")}
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-yellow-300 transition-all duration-300">
                {t("contact")}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">
            {t("connect")}
          </h3>

          <p>{t("email")}: info@rakshapeeth.com</p>
          <p>{t("phone")}: +91 12345 67890</p>

          <div className="flex space-x-4 mt-3">
            <a
              href="#"
              className="p-2 bg-cream/20 rounded-full hover:bg-cream/50 text-brown shadow-lg transition-all duration-300 hover:scale-110"
            >
              🐦
            </a>

            <a
              href="#"
              className="p-2 bg-cream/20 rounded-full hover:bg-cream/50 text-brown shadow-lg transition-all duration-300 hover:scale-110"
            >
              🔗
            </a>

            <a
              href="#"
              className="p-2 bg-cream/20 rounded-full hover:bg-cream/50 text-brown shadow-lg transition-all duration-300 hover:scale-110"
            >
              📘
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-cream/40 mt-6 py-4 text-center text-cream/70 relative z-10">
        © {new Date().getFullYear()} {t("footerBrand")}. {t("rightsReserved")}
      </div>

    </footer>
  );
}