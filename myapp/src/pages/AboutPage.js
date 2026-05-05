import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import HeaderNavbarAbout from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import FooterAbout from "../components/FooterAbout";
import { useTranslation } from "react-i18next";
export default function AboutPage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");

  const registerRef = useRef(null);
  const moreRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (registerRef.current && !registerRef.current.contains(event.target)) {
        setRegisterOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
  localStorage.setItem("lang", language);
}, [language]);
  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-cream to-cream/90 flex flex-col">
      {/* Header */}
      <HeaderNavbarAbout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        registerOpen={registerOpen}
        setRegisterOpen={setRegisterOpen}
        moreOpen={moreOpen}
        setMoreOpen={setMoreOpen}
        registerRef={registerRef}
        moreRef={moreRef}
        language={language} // Pass language to header
        labels={{
        home: t("home"),
        about: t("about"),
        register: t("customerCare"),
        contact: t("contactUs"),
      }} // header labels
            />

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />


      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 text-brown">
        <h2 className="text-4xl md:text-5xl mb-8 text-center text-brown/90 underline decoration-cream/60">
          {t("aboutTitle")}
        </h2>

        <div className="flex flex-col md:flex-row items-start bg-cream/60 rounded-2xl shadow-xl p-8 md:p-12 space-x-0 md:space-x-8 space-y-6 md:space-y-0 text-brown/90 leading-relaxed text-lg">
          {/* Left Image */}
          <img src={Logo} alt="Rakshapeeth" className="w-full md:w-1/3 rounded-2xl shadow-lg" />

          {/* Text */}
          <div className="md:flex-1 text-justify">
            <p className="first-letter:text-6xl first-letter:font-serif first-letter:float-left first-letter:mr-2 first-letter:leading-tight first-letter:-mt-2">
              {t("aboutPara1")}
            </p>
            <p>{t("aboutPara2")}</p>
            <p>{t("aboutPara3")}</p>
            <p>{t("aboutPara4")}</p>
            <p>{t("aboutPara5")}</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterAbout
        language={language} // Pass language
        labels={{
        quickLinks: t("footerQuickLinks"),
        connect: t("footerConnect"),
}}
quickLinks={[t("home"), t("about"), t("customerCare"), t("contactUs")]}
connect={{
  email: t("footerEmail"),
  phone: t("footerPhone"),
}}
      />
    </div>
  );
}