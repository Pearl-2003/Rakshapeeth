import React, { useState, useEffect, useRef } from "react";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function HeaderNavbar({ sidebarOpen, setSidebarOpen }) {
  const [registerOpen, setRegisterOpen] = useState(false);
  const registerRef = useRef(null);

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
    <div className="font-sans bg-gradient-to-b from-cream to-cream/90">
      {/* Top Hero Section */}
      <header className="relative bg-brown bg-opacity-90">
        <div className="max-w-7xl mx-auto flex items-center px-6 py-4 md:py-3 space-x-32">
          {/* Logo */}
          <img
            src={Logo}
            alt="Logo"
            className="h-28 w-28 md:h-36 md:w-36 rounded-full border-4 border-cream shadow-lg transform hover:scale-105 transition-transform duration-500"
          />
          {/* Heading */}
          <div className="flex flex-col items-center md:items-start relative">
            <h1
              className="
                text-6xl md:text-8xl font-extrabold text-cream tracking-widest
                text-center md:text-left
                font-[Bebas\ Neue]
                relative
                transition-transform duration-500 hover:scale-105
              "
              style={{
                textShadow: `
                  2px 2px 0px #8B6B4F,
                  4px 4px 0px #7A5940,
                  6px 6px 10px rgba(107,79,59,0.5)
                `
              }}
            >
              RAKSHAPEETH
              <span className="
                absolute top-0 left-0 w-full h-full
                bg-gradient-to-r from-white/40 via-white/10 to-white/40
                opacity-30 animate-[shine_2s_linear_infinite]
                pointer-events-none
              "></span>
            </h1>
            <div className="mt-2 w-32 h-1 rounded-full bg-cream/70 animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Navbar */}
      <nav className="sticky top-0 w-full bg-brown text-white flex justify-between items-center px-6 py-3 shadow-lg z-50">
        <div className="flex items-center space-x-6">
          {/* Hamburger Menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex flex-col justify-center items-center w-10 h-10 space-y-1 rounded-md bg-cream text-brown p-2 hover:bg-cream-200 transition-transform transform hover:scale-110 shadow-md"
          >
            <span className="block w-6 h-0.5 bg-brown"></span>
            <span className="block w-6 h-0.5 bg-brown"></span>
            <span className="block w-6 h-0.5 bg-brown"></span>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="font-semibold hover:text-cream-200 transition duration-300">
              Home
            </Link>
            <Link to="/about" className="font-semibold hover:text-cream-200 transition duration-300">
              About
            </Link>
            <Link to="/customer-care" className="font-semibold hover:text-cream-200 transition duration-300">
              Customer Care
            </Link>
            <Link to="/contact-us" className="font-semibold hover:text-cream-200 transition duration-300">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-60 md:w-72 px-4 py-2 rounded-full text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cream-200 focus:shadow-lg transition-all duration-300 transform hover:scale-105"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        </div>
      </nav>
    </div>
  );
}
