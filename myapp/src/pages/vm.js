import notifyVideoFile from "../assets/veh.mp4";
import React, { useState, useEffect, useRef } from "react";
import Logo from "../assets/logo.png";
import gateImg from "../assets/gate.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
export default function NotifyPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

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

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-cream to-cream/90">

      <HeaderNavbar
             sidebarOpen={sidebarOpen}
             setSidebarOpen={setSidebarOpen}
             registerOpen={registerOpen}
             setRegisterOpen={setRegisterOpen}
             moreOpen={moreOpen}
             setMoreOpen={setMoreOpen}
             registerRef={registerRef}
             moreRef={moreRef}
           />
     
           {/* Sidebar Overlay */}
           {sidebarOpen && (
             <div
               className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
               onClick={() => setSidebarOpen(false)}
             ></div>
           )}
     
           {/* Sidebar */}
           <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
     

       <main className="p-6 md:p-12 max-w-7xl mx-auto bg-gradient-to-br from-cream/95 to-cream/90 rounded-3xl shadow-2xl overflow-hidden relative">
  {/* Decorative background shapes */}
  <div className="absolute -top-10 -left-10 w-32 h-32 bg-brown/10 rounded-full blur-3xl animate-pulse-slow"></div>
  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brown/10 rounded-full blur-3xl animate-pulse-slow"></div>

  <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
    {/* Video */}
    <div className="w-full md:w-1/2 flex justify-center">
      <video
        src={notifyVideoFile}
        controls
        className="w-full max-w-[350px] md:max-w-full aspect-[9/16] rounded-3xl shadow-2xl border-4 border-cream hover:scale-105 transform transition-all duration-500"
      />
    </div>

   {/* Description */}
<div className="w-full md:w-1/2 text-brown space-y-6 text-justify">
  <h2 className="text-3xl md:text-4xl font-extrabold tracking-wider text-center md:text-left relative">
    Vehicle Management
    <span className="block h-1 w-24 bg-gradient-to-r from-brown to-brown/70 rounded-full mt-2 mx-auto md:mx-0 animate-pulse-slow"></span>
  </h2>

  <p className="text-lg md:text-xl leading-relaxed text-brown/90 first-letter:text-6xl first-letter:font-bold first-letter:text-brown/80 first-letter:mr-2">
    AGSS-BV’s <span className="font-semibold">Vehicle Management</span> system, powered by Rakshapeeth, brings intelligent, automated control to campus vehicle access. As a vehicle approaches the gate, its number plate is captured and processed using advanced license plate recognition technology. The system then classifies the vehicle into one of four categories:
  </p>

  <p className="text-lg md:text-xl leading-relaxed text-brown/90">
    <span className="font-semibold">Whitelisted Vehicles</span> – Permanent campus vehicles, such as those belonging to staff, faculty, or registered students, are instantly recognized. The gate opens automatically, and the vehicle’s entry is logged for record-keeping.
  </p>

  <p className="text-lg md:text-xl leading-relaxed text-brown/90">
    <span className="font-semibold">Occasional Visitors</span> – Vehicles from parents, guests, or vendors who have pre-registered for a specific time slot are verified automatically for access.
  </p>

  <p className="text-lg md:text-xl leading-relaxed text-brown/90">
    <span className="font-semibold">Blacklisted Vehicles</span> – Vehicles flagged for security concerns are immediately denied entry, and security personnel are alerted in real time.
  </p>

  <p className="text-lg md:text-xl leading-relaxed text-brown/90">
    <span className="font-semibold">Unregistered Vehicles</span> – Any vehicle not present in the database triggers a secure manual approval process. Campus security can verify the visitor’s credentials and grant temporary access while maintaining detailed records.
  </p>

  <p className="text-lg md:text-xl leading-relaxed text-brown/90">
    This system ensures that every vehicle entering the campus is accurately monitored and accounted for. By automating recognition, verification, and logging, AGSS-BV enhances security, reduces congestion at the gate, and streamlines the vehicle entry process. Whether it is routine staff traffic or an occasional visitor, the Vehicle Management system delivers <span className="italic text-brown/80">safety, efficiency, and complete control</span> over campus access.
  </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-8 py-3 bg-brown text-cream rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl hover:bg-gradient-to-r from-brown/90 to-brown/70 transition-all duration-300 font-semibold"
      >
        ← Back to Home
      </button>
    </div>
  </div>
</main>

      <footer className="bg-gradient-to-r from-brown to-brown/90 text-cream mt-16 relative overflow-hidden">
  {/* Decorative subtle shapes */}
  <div className="absolute -top-10 -left-10 w-32 h-32 bg-cream/10 rounded-full blur-3xl animate-pulse-slow"></div>
  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cream/10 rounded-full blur-3xl animate-pulse-slow"></div>

  <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 relative z-10">
    {/* About / Branding */}
    <div className="space-y-4">
      <h2 className="text-3xl font-extrabold tracking-wide">RAKSHAPEETH</h2>
      <p className="text-cream/80">
        Automated Gate Security System for Banasthali Vidyapith.
      </p>
    </div>

    {/* Quick Links */}
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">Quick Links</h3>
      <ul className="space-y-1">
        <li>
          <a href="#" className="hover:text-yellow-300 transition-all duration-300">Home</a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-300 transition-all duration-300">About</a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-300 transition-all duration-300">Register</a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-300 transition-all duration-300">Contact Us</a>
        </li>
      </ul>
    </div>

    {/* Contact / Social */}
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">Connect</h3>
      <p>Email: info@rakshapeeth.com</p>
      <p>Phone: +91 12345 67890</p>
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

  <div className="border-t border-cream/40 mt-6 py-4 text-center text-cream/70 relative z-10">
    © {new Date().getFullYear()} RAKSHAPEETH. All rights reserved.
  </div>
</footer>
    </div>
  );
}