// Updated HeaderNavbar component 
import React, { useState, useRef, useEffect } from "react";
import Logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { logout } from "../utils/auth"; // 👈 Import logout function
  import { logoutAndClearHistory } from "../utils/clearHistory";

export default function HeaderNavbar({ sidebarOpen, setSidebarOpen, adminName }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false); 
  const [avatarTrigger, setAvatarTrigger] = useState(0); 

  const [avatarUpdateFlag, setAvatarUpdateFlag] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const userPhoto = localStorage.getItem("userPhoto");

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  useEffect(() => {
    function refreshAvatar() {
      setAvatarTrigger(prev => prev + 1);
    }

    window.addEventListener("avatarChanged", refreshAvatar);
    window.addEventListener("storage", refreshAvatar);

    return () => {
      window.removeEventListener("avatarChanged", refreshAvatar);
      window.removeEventListener("storage", refreshAvatar);
    };
  }, []);

  // 🔥 Listen for avatar changes from avatar.html
  useEffect(() => {
    function refreshAvatar() {
      setAvatarUpdateFlag((prev) => prev + 1);
    }

    window.addEventListener("avatarChanged", refreshAvatar);
    window.addEventListener("storage", refreshAvatar);

    return () => {
      window.removeEventListener("avatarChanged", refreshAvatar);
      window.removeEventListener("storage", refreshAvatar);
    };
  }, []);

  // ✅ FIXED: Use the role from localStorage
  // const handleLogout = () => {
  //   const role = localStorage.getItem("role"); // Get current role
    
  //   if (role === "parent") {
  //     logout("parent");
  //   } else if (role === "admin") {
  //     logout("admin");
  //   } else if (role === "guard") {
  //     logout("guard");
  //   } else {
  //     // Fallback
  //     localStorage.clear();
  //       navigate("/login", { replace: true }); // 👈 This replaces current history entry

  //   }
  // };

const handleLogout = () => {
  const role = localStorage.getItem("role");
  logoutAndClearHistory(role, navigate);
};

  return (
    <div className="font-sans bg-gradient-to-b from-cream to-cream/90">
      <header className="relative bg-brown bg-opacity-90">
        <div className="max-w-7xl mx-auto flex items-center px-6 py-4 md:py-3 space-x-32">
          <img
            src={Logo}
            alt="Logo"
            className="h-28 w-28 md:h-36 md:w-36 rounded-full border-4 border-cream shadow-lg"
          />
          <h1 className="text-6xl md:text-8xl font-extrabold text-cream tracking-widest">
            RAKSHAPEETH
          </h1>
        </div>
      </header>

      <nav className="sticky top-0 w-full bg-brown text-white flex justify-between items-center px-6 py-3 shadow-lg z-50">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex flex-col justify-center items-center w-10 h-10 space-y-1 rounded-md bg-cream text-brown p-2 hover:scale-110 transition"
          >
            <span className="block w-6 h-0.5 bg-brown"></span>
            <span className="block w-6 h-0.5 bg-brown"></span>
            <span className="block w-6 h-0.5 bg-brown"></span>
          </button>

          <div className="hidden md:flex space-x-8">
            <Link to="/parent/dashboard" className="font-semibold hover:text-cream-200">Home</Link>
            <Link to="/customer-care-parent" className="font-semibold hover:text-cream-200">Customer Care</Link>
            <Link to="/ContactUs-parent" className="font-semibold hover:text-cream-200">Contact Us</Link>
          </div>
        </div>

        {/* Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Avatar
            photoURL={localStorage.getItem("avatar") || userPhoto}
            name={adminName}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 bg-white text-black rounded-2xl shadow-2xl w-52 p-3 z-50">
              <div className="text-center font-semibold border-b pb-2">
                {adminName || "User"}
              </div>
              <button
                onClick={() => setShowAvatarModal(true)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg mt-2"
              >
                Choose Avatar 🎨
              </button>

              <button
                onClick={() => navigate("/parent/settings")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg mt-2"
              >
                Settings ⚙️
              </button>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg"
              >
                Logout 🚪
              </button>
            </div>
          )}
        </div>
      </nav>
      
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-center text-brown">
              Select Your Avatar
            </h2>

            <div className="grid grid-cols-3 gap-4 max-h-80 overflow-y-auto">
              {[
                "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/1.png",
                "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/2.png",
                "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/3.png",
                "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/4.png",
                "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/5.png",
                "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/6.png",
                "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/1.png",
                "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/2.png",
                "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/3.png",
                "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/4.png"
              ].map((url, index) => (
                <img
                  key={index}
                  src={url}
                  onClick={() => {
                    localStorage.setItem("avatar", url);
                    window.dispatchEvent(new Event("avatarChanged"));
                    setShowAvatarModal(false);
                  }}
                  className="w-24 h-24 rounded-xl object-cover cursor-pointer hover:scale-110 hover:ring-4 hover:ring-brown transition"
                />
              ))}
            </div>

            <button
              onClick={() => setShowAvatarModal(false)}
              className="mt-5 w-full py-2 bg-brown text-white rounded-xl hover:bg-opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}