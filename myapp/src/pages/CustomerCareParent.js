import React, { useState } from "react";
import Logo from "../assets/logo.png";

import HeaderNavbar from "../components/HeaderNavbar4";
import Sidebar from "../components/Sidebar3";
import Footer from "../components/Footer";

export default function CustomerCarePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I register on the website?",
      answer:
        "To register, visit the Register page and fill in the required details. Once submitted, your account will be verified and activated. If you face issues, ensure you have a stable internet connection or contact Customer Care."
    },
    {
      question: "How do I log in if I’m facing issues?",
      answer:
        "Use the Login page with your registered credentials. If login fails, double-check your username and password, or use the 'Forgot Password' option. Persistent issues may be due to cache or network problems."
    },
    {
      question: "How do I fill out the Pre-Visit Form, and what should I do if it doesn’t work?",
      answer:
        "The Pre-Visit Form is on both the Visitor and Parent pages. Fill all details and submit. If it doesn’t load, it may be a network issue — please contact Customer Care."
    },
    {
      question: "What should I do if there’s a problem with the iris scan or number plate scanning system?",
      answer:
        "Check that the scanning device is clean, connected, and aligned. If issues persist, contact Technical Support via Customer Care."
    },
    {
      question: "How can I send an alert to the admin?",
      answer:
        "Authorized users can send alerts to the admin from their dashboard. If your alert isn’t sending, verify your connection and contact support."
    },
    {
      question: "What should I do if there’s an issue with the parent notification system?",
      answer:
        "If parents aren’t receiving notifications, verify their contact info and your connection. If the issue continues, report it via Customer Care."
    },
    {
      question: "Who are authorized users, and what are their responsibilities?",
      answer:
        "Authorized users include admin, parents, and daily visitors. They must protect their credentials and report suspicious activity."
    },
    {
      question: "How can I view expected visitors?",
      answer:
        "Guards and authorized staff can view expected visitors under the 'View Visitors' option in the Guard Page sidebar."
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
        <h1 className="text-5xl font-extrabold mb-2 tracking-wide">Customer Care</h1>
        <p className="text-lg max-w-2xl mx-auto text-cream/80">
          Welcome to Rakshapeeth’s Customer Care page. Find solutions to common questions and get instant assistance.
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