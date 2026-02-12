import React, { useState } from "react";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import campusVideo from "../../assets/campus.mp4";

export default function CCTVMonitoring() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCamera, setActiveCamera] = useState(null);
const cameras = [
  {
    id: 1,
    name: "Main Gate",
    location: "North Entrance",
    video: campusVideo
  },
  {
    id: 2,
    name: "Hostel Block A",
    location: "Girls Hostel",
    video: campusVideo
  },
  {
    id: 3,
    name: "Academic Block",
    location: "CSE Department",
    video: campusVideo
  },
  {
    id: 4,
    name: "Library",
    location: "Central Library",
    video: campusVideo
  },
  {
    id: 5,
    name: "Parking Area",
    location: "Staff Parking",
    video: campusVideo
  },
  {
    id: 6,
    name: "Cafeteria",
    location: "Food Court",
    video: campusVideo
  }
];


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7eddc] to-[#efe0c6] text-[#5C3A21]">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="px-6 md:px-12 lg:px-20 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold">
            Campus CCTV Monitoring
          </h1>
          <p className="mt-2 text-[#7B4B2A]/80">
            Real-time surveillance overview of campus zones
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cameras.map((cam) => (
            <motion.div
              key={cam.id}
              whileHover={{ scale: 1.02 }}
              className="relative rounded-3xl overflow-hidden bg-[#fffaf4]
              border border-[#7B4B2A]/30
              shadow-[0_20px_50px_rgba(123,75,42,0.25)]"
            >
              <div className="relative h-56 bg-black">
                <video
                  src={cam.video}
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />

                {/* LIVE badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  LIVE
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg">{cam.name}</h3>
                <p className="text-sm text-[#7B4B2A]/70">{cam.location}</p>

                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-green-700 font-medium">
                    ● Online
                  </span>
                  <button
                    onClick={() => setActiveCamera(cam)}
                    className="text-[#7B4B2A] font-semibold hover:underline"
                  >
                    View Fullscreen
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />

      {/* FULLSCREEN MODAL */}
      <AnimatePresence>
        {activeCamera && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full max-w-5xl">
              <button
                onClick={() => setActiveCamera(null)}
                className="absolute -top-10 right-0 text-white text-xl font-bold"
              >
                ✕ Close
              </button>

              <video
                src={activeCamera.video}
                autoPlay
                muted
                loop
                controls
                className="w-full rounded-2xl shadow-2xl"
              />

              <div className="mt-4 text-white">
                <h3 className="text-xl font-bold">
                  {activeCamera.name}
                </h3>
                <p className="text-sm opacity-80">
                  {activeCamera.location}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
