import React, { useState } from "react";
import Logo from "../assets/logo.png";
import { useTranslation } from "react-i18next";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function CustomerCarePage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

    const faqs = [
    {
      question: t("faq1q"),
      answer: t("faq1a")
    },
    {
      question: t("faq2q"),
      answer: t("faq2a")
    },
    {
      question: t("faq3q"),
      answer: t("faq3a")
    },
    {
      question: t("faq4q"),
      answer: t("faq4a")
    },
    {
      question: t("faq5q"),
      answer: t("faq5a")
    },
    {
      question: t("faq6q"),
      answer: t("faq6a")
    },
    {
      question: t("faq7q"),
      answer: t("faq7a")
    },
    {
      question: t("faq8q"),
      answer: t("faq8a")
    }
  ];
  return (
    <div className="font-sans bg-gradient-to-b from-cream to-cream/90 relative">
      {/* Header + Navbar */}
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} id="sidebar" />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Hero Section */}
      <header className="bg-brown text-cream text-center py-16 shadow-lg">
        <h1 className="text-5xl font-extrabold mb-2 tracking-wide">{t("customerCare")}</h1>
        <p className="text-lg max-w-2xl mx-auto text-cream/80">
          {t("customerCareDesc")}
        </p>
      </header>

      {/* FAQ Section */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-4 flex justify-between items-center font-semibold text-brown text-lg focus:outline-none"
              >
                {faq.question}
                <span
                  className={`text-xl transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-brown/80 border-t border-brown/20">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}