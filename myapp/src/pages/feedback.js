//feedback.js
import React, { useState, useEffect, useRef } from "react";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";

export default function ParentRegister() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const registerRef = useRef(null);
  const moreRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    function handleClickOutside(event) {
      if (registerRef.current && !registerRef.current.contains(event.target))
        setRegisterOpen(false);
      if (moreRef.current && !moreRef.current.contains(event.target))
        setMoreOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedbackType: "Suggestion",
    message: ""
  });

  const [errors, setErrors] = useState({});

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    let error = "";

    if (!value.trim()) {
      error = `${name} is required`;
    }

    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!emailRegex.test(value)) {
        error = "Please enter a valid email address";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim())
      newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/feedback/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Thank You!",
          text: "Your feedback has been submitted successfully.",
          confirmButtonColor: "#8B5E3C"
        });

        setFormData({
          name: "",
          email: "",
          feedbackType: "Suggestion",
          message: ""
        });

        setErrors({});
      } else {
        Swal.fire("Error", data.message || "Failed to submit feedback", "error");
      }
    } catch (error) {
      console.error("Feedback submit error:", error);
      Swal.fire("Error", "Server error. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-[#f9ede3] via-[#f5e3d1] to-[#e7c9a9] flex flex-col">
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

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-16 text-brown">
        <h2 className="text-4xl md:text-5xl mb-12 text-center font-extrabold">
          Feedback Form
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-brown/20 p-12 rounded-3xl shadow-2xl space-y-8 max-w-3xl mx-auto"
        >
          {/* Name */}
          <div>
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 rounded ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && <p className="text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 rounded ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && <p className="text-red-600">{errors.email}</p>}
          </div>

          {/* Feedback Type */}
          <div>
            <label>Feedback Type</label>
            <select
              name="feedbackType"
              value={formData.feedbackType}
              onChange={handleChange}
              className="w-full p-3 rounded"
            >
              <option>Suggestion</option>
              <option>Bug Report</option>
              <option>Compliment</option>
              <option>Other</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label>Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className={`w-full p-3 rounded ${
                errors.message ? "border-red-500" : ""
              }`}
            />
            {errors.message && (
              <p className="text-red-600">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#8B5E3C] text-white rounded-full"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}