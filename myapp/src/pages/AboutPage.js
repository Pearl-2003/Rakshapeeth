import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import HeaderNavbarAbout from "../components/HeaderNavbarAbout";
import Sidebar from "../components/Sidebar";
import FooterAbout from "../components/FooterAbout";

export default function AboutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [language, setLanguage] = useState("en"); // Language state

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

  // Translation object
  const translations = {
    en: {
      aboutTitle: "About Us",
      para1:
        "Rakshapeeth is an advanced automated gate security system designed specifically for universities and educational institutions. Our goal is to redefine campus safety by combining cutting-edge technology with intelligent automation — ensuring a secure, efficient, and transparent access management experience for students, staff, and visitors.",
      para2:
        "For students, Rakshapeeth offers a dual-layer verification system that combines iris recognition with student ID scanning. This ensures that every individual entering the campus is verified beyond doubt, creating a reliable and tamper-proof layer of protection for the institution.",
      para3:
        "When it comes to visitors, Rakshapeeth provides a truly smart experience. Its number plate recognition system automatically scans and validates incoming vehicles, while unregistered guests can still be logged manually for security tracking. Visitors can also submit pre-visit requests, making entry more convenient and organized. If a blacklisted user or vehicle is detected, Rakshapeeth immediately triggers an alert to security personnel, ensuring that potential threats are addressed instantly and effectively.",
      para4:
        "Safety goes beyond the gate. With Rakshapeeth’s real-time parent notification system, parents receive instant alerts whenever their child enters or exits the campus. This promotes peace of mind, transparency, and trust between families and institutions.",
      para5:
        "At its core, Rakshapeeth is more than a security system — it’s a vision for safer campuses through innovation. By merging advanced verification, intelligent monitoring, and real-time communication, Rakshapeeth empowers universities to create a secure and connected environment where safety is effortless, reliable, and future-ready.",
      quickLinks: ["Home", "About", "Customer Care", "Contact Us"],
      connect: { email: "Email: info@rakshapeeth.com", phone: "Phone: +91 12345 67890" },
      header: { home: "Home", about: "About", register: "Customer Care", contact: "Contact Us" },
      footerQuickLinks: "Quick Links",
      footerConnect: "Connect",
    },
    hi: {
      aboutTitle: "रक्षापीठ के विषय में",
      para1:
        "रक्षापीठ एक उन्नत स्वचालित गेट सुरक्षा प्रणाली है, जो विशेष रूप से विश्वविद्यालयों और शैक्षिक संस्थानों के लिए डिज़ाइन की गई है। हमारा लक्ष्य अत्याधुनिक तकनीक और बुद्धिमान स्वचालन के संयोजन के माध्यम से कैंपस सुरक्षा को फिर से परिभाषित करना है — जिससे छात्रों, कर्मचारियों और आगंतुकों के लिए एक सुरक्षित, कुशल और पारदर्शी प्रवेश प्रबंधन अनुभव सुनिश्चित हो सके।",
      para2:
        "छात्रों के लिए, रक्षापीठ एक डुअल-लेयर सत्यापन प्रणाली प्रदान करता है, जो आइरिस मान्यता और छात्र आईडी स्कैनिंग को जोड़ती है। यह सुनिश्चित करता है कि कैंपस में प्रवेश करने वाला प्रत्येक व्यक्ति संदेह से परे सत्यापित हो, और संस्थान के लिए एक विश्वसनीय और छेड़छाड़-रहित सुरक्षा स्तर बनता है।",
      para3:
        "आगंतुकों के मामले में, रक्षापीठ वास्तव में स्मार्ट अनुभव प्रदान करता है। इसका नंबर प्लेट पहचान प्रणाली स्वचालित रूप से आने वाली गाड़ियों को स्कैन और मान्य करती है, जबकि पंजीकृत नहीं किए गए आगंतुकों को मैन्युअल रूप से लॉग किया जा सकता है। आगंतुक प्री-वीज़िट अनुरोध भी जमा कर सकते हैं, जिससे प्रवेश अधिक सुविधाजनक और व्यवस्थित हो जाता है। यदि कोई काला सूचीबद्ध उपयोगकर्ता या वाहन पाया जाता है, तो रक्षापीठ तुरंत सुरक्षा कर्मियों को अलर्ट करता है।",
      para4:
        "सुरक्षा केवल गेट तक सीमित नहीं है। रक्षापीठ की रीयल-टाइम अभिभावक सूचना प्रणाली के साथ, माता-पिता को तुरंत अलर्ट मिलते हैं जब भी उनका बच्चा कैंपस में प्रवेश या बाहर निकलता है। इससे परिवारों और संस्थानों के बीच शांति, पारदर्शिता और विश्वास बढ़ता है।",
      para5:
        "मूल रूप से, रक्षापीठ केवल एक सुरक्षा प्रणाली से अधिक है — यह नवाचार के माध्यम से सुरक्षित कैंपस के लिए एक दृष्टि है। उन्नत सत्यापन, बुद्धिमान निगरानी और रीयल-टाइम संचार को मिलाकर, रक्षापीठ विश्वविद्यालयों को एक सुरक्षित और जुड़ा हुआ वातावरण बनाने में सक्षम बनाता है।",
      quickLinks: ["होम", "हमारे बारे में", "ग्राहक सेवा", "संपर्क करें"],
      connect: { email: "ईमेल: info@rakshapeeth.com", phone: "फोन: +91 12345 67890" },
      header: { home: "होम", about: "हमारे बारे में", register: "ग्राहक सेवा", contact: "संपर्क करें" },
      footerQuickLinks: "त्वरित लिंक",
      footerConnect: "संपर्क करें",
    },
  };

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
        labels={translations[language].header} // header labels
      />

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Language Toggle */}
      <div className="flex justify-center mt-8 mb-4">
        <button
          onClick={() => setLanguage("en")}
          className={`px-4 py-2 rounded-l ${language === "en" ? "bg-brown text-cream" : "bg-cream text-brown"}`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage("hi")}
          className={`px-4 py-2 rounded-r ${language === "hi" ? "bg-brown text-cream" : "bg-cream text-brown"}`}
        >
          हिंदी
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 text-brown">
        <h2 className="text-4xl md:text-5xl mb-8 text-center text-brown/90 underline decoration-cream/60">
          {translations[language].aboutTitle}
        </h2>

        <div className="flex flex-col md:flex-row items-start bg-cream/60 rounded-2xl shadow-xl p-8 md:p-12 space-x-0 md:space-x-8 space-y-6 md:space-y-0 text-brown/90 leading-relaxed text-lg">
          {/* Left Image */}
          <img src={Logo} alt="Rakshapeeth" className="w-full md:w-1/3 rounded-2xl shadow-lg" />

          {/* Text */}
          <div className="md:flex-1 text-justify">
            <p className="first-letter:text-6xl first-letter:font-serif first-letter:float-left first-letter:mr-2 first-letter:leading-tight first-letter:-mt-2">
              {translations[language].para1}
            </p>
            <p>{translations[language].para2}</p>
            <p>{translations[language].para3}</p>
            <p>{translations[language].para4}</p>
            <p>{translations[language].para5}</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterAbout
        language={language} // Pass language
        labels={{ quickLinks: translations[language].footerQuickLinks, connect: translations[language].footerConnect }}
        quickLinks={translations[language].quickLinks}
        connect={translations[language].connect}
      />
    </div>
  );
}