import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import HeaderNavbar from "../../components/HeaderNavbar4";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

export default function ParentVisitRequest() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
   const [loading, setLoading] = useState(false);
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

  const [formData, setFormData] = useState({
    dateOfVisit: "",
    vehicleNo: "",
    noOfCompanions: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { dateOfVisit, noOfCompanions } = formData;

    // ❌ Frontend validation
    if (!dateOfVisit || noOfCompanions === "") {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all required fields before submitting.",
        confirmButtonColor: "#6b4226"
      });
      return;
    }

    const token = localStorage.getItem("parentToken");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please login again to continue.",
        confirmButtonColor: "#6b4226"
      });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/parent/visit-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await res.json();

      // 🔴 DUPLICATE REQUEST
      if (res.status === 409) {
        Swal.fire({
          icon: "info",
          title: "Request Already Made",
          text: data.message || "You have already requested a visit for this date.",
          confirmButtonColor: "#6b4226"
        });
        return;
      }

      // ❌ OTHER ERRORS
      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Request Failed",
          text: data.message || "Something went wrong. Please try again.",
          confirmButtonColor: "#6b4226"
        });
        return;
      }

      // ✅ SUCCESS
      Swal.fire({
        icon: "success",
        title: "Visit Confirmed 🎉",
        text: "Your visit request has been submitted successfully.",
        confirmButtonColor: "#6b4226"
      });

      // 🔄 Reset form
      setFormData({
        dateOfVisit: "",
        vehicleNo: "",
        noOfCompanions: ""
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server. Please try later.",
        confirmButtonColor: "#6b4226"
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-cream to-cream/90 flex flex-col">

      {/* HEADER + SIDEBAR */}
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

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN CONTENT */}
      <main className="flex-grow flex items-center justify-center px-6 py-24 text-brown">
        <div className="relative w-full max-w-2xl bg-cream/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.18)] px-12 py-14 overflow-hidden">

          {/* Premium Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brown/20 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brown/20 rounded-full blur-[120px]"></div>

          {/* HEADING */}
          <div className="relative z-10 text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide text-brown drop-shadow-sm">
              Visit Request
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brown to-brown/60 mx-auto my-4 rounded-full"></div>
            <p className="text-brown/70 text-lg max-w-md mx-auto">
              Submit your visit details securely and get real-time updates.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-brown/80">
                Date of Visit
              </label>
              <input
                type="date"
                name="dateOfVisit"
                value={formData.dateOfVisit}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 rounded-2xl bg-white/90 focus:outline-none focus:ring-4 focus:ring-brown/30 shadow-inner text-brown"
              />
            </div>

            {/* Vehicle */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-brown/80">
                Vehicle Number
              </label>
              <input
                type="text"
                name="vehicleNo"
                value={formData.vehicleNo}
                onChange={handleChange}
                placeholder="RJ14 AB 1234"
                className="w-full px-5 py-4 rounded-2xl bg-white/90 focus:outline-none focus:ring-4 focus:ring-brown/30 shadow-inner uppercase text-brown"
              />
            </div>

            {/* Companions */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-brown/80">
                Number of Companions
              </label>
              <input
                type="number"
                name="noOfCompanions"
                value={formData.noOfCompanions}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-5 py-4 rounded-2xl bg-white/90 focus:outline-none focus:ring-4 focus:ring-brown/30 shadow-inner text-brown"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full mt-10 py-4 rounded-2xl bg-gradient-to-r from-brown to-[#5a351d] text-cream text-lg font-bold tracking-wide shadow-[0_15px_40px_rgba(91,53,29,0.5)] hover:shadow-[0_20px_50px_rgba(91,53,29,0.6)] hover:scale-[1.03] transition-all duration-300"
            >
              Submit Visit Request
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
