//feedback.js
import React, { useState, useEffect, useRef } from "react";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
export default function ParentRegister() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const nameRegex = /^[A-Za-z\u0900-\u097F\s]{3,50}$/; // only letters & spaces
  const registerRef = useRef(null);
  const moreRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === "hi"; // detect if current language is Hindi
  const hindiLayout = {
  default: [
    "१ २ ३ ४ ५ ६ ७ ८ ९ ० {bksp}",
    "क ख ग घ ङ च छ ज झ ञ",
    "ट ठ ड ढ ण त थ द ध न",
    "प फ ब भ म य र ल व",
    "श ष स ह",
    "ा ि ी ु ू े ै ो ौ ं ः",
    "{space} {del}"
  ]
};

const display = {
  "{bksp}": "⌫",
  "{del}": "DEL",
  "{space}": "SPACE"
};
const onKeyboardChange = (input) => {
  if (!activeInput) return;
  setFormData((prev) => ({
    ...prev,
    [activeInput]: input
  }));
};

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

  let newValue = value;

  // Prevent numbers in name
  if (name === "name") {
    newValue = value.replace(/[0-9]/g, ""); // remove digits
  }

  setFormData((prev) => ({
    ...prev,
    [name]: newValue
  }));

  // Validation
  let error = "";

  if (!newValue.trim()) {
    error = t("fieldRequired", { field: t(name) });
  } else if (name === "name" && !/^[A-Za-z\u0900-\u097F\s]{3,50}$/.test(newValue)) {
    error = t("invalidName"); // e.g., "Name can only contain letters"
  }

  if (name === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newValue.trim()) {
      error = t("fieldRequired", { field: t("email") });
    } else if (!emailRegex.test(newValue)) {
      error = t("invalidEmail");
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

    if (!formData.name.trim())
  newErrors.name = t("fieldRequired", { field: t("name") });
    if (!formData.email.trim()) {
      newErrors.email = t("fieldRequired", { field: t("email") });
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t("invalidEmail");
    }
    if (!formData.message.trim())
      newErrors.message = t("fieldRequired", { field: t("message") });

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
          title: t("thankYou"),
text: t("feedbackSuccess"),
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
          {t("feedbackTitle")}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-brown/20 p-12 rounded-3xl shadow-2xl space-y-8 max-w-3xl mx-auto"
        >
          {/* Name */}
          <div>
            <label>{t("name")} *</label>
            <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => {
              setActiveInput("name");
              if (isHindi) setShowKeyboard(true);
            }}
            className={`w-full p-3 rounded ${errors.name ? "border-red-500" : ""}`}
          />
            {errors.name && <p className="text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label>{t("email")} *</label>
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
            <label>{t("feedbackType")}</label>
            <select
              name="feedbackType"
              value={formData.feedbackType}
              onChange={handleChange}
              className="w-full p-3 rounded"
            >
               <option value="Suggestion">{t("suggestion")}</option>
                <option value="Bug Report">{t("bugReport")}</option>
                <option value="Compliment">{t("compliment")}</option>
                <option value="Other">{t("other")}</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label>{t("message")} *</label>
            <textarea
            name="message"
            value={formData.message}
            rows="5"
            onChange={handleChange}
            onFocus={() => {
              setActiveInput("message");
              if (isHindi) setShowKeyboard(true);
            }}
            className={`w-full p-3 rounded ${errors.message ? "border-red-500" : ""}`}
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
           {loading ? t("submitting") : t("submitFeedback")}
          </button>
        </form>
        {showKeyboard && isHindi && (
  <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 z-50">
    <Keyboard
      layout={hindiLayout}
      display={display}
      onChange={onKeyboardChange}
    />

    <div className="flex justify-end mt-2">
      <button
        type="button"
        onClick={() => setShowKeyboard(false)}
        className="px-4 py-2 bg-[#8B5E3C] text-white rounded-lg"
      >
        कीबोर्ड बंद करें
      </button>
    </div>
  </div>
)}
      </main>

      <Footer />
    </div>
  );
}