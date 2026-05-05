// src/pages/ParentRegister.js
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Logo from "../assets/logo.png";
import { useTranslation } from "react-i18next";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
const MySwal = withReactContent(Swal);

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

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  
  return re.test(email);
}

function validatePhone(phone) {
  if (!phone) return false;

  const digits = phone.replace(/\D/g, "");
  return /^[6-9]\d{9}$/.test(digits);
}

function validateName(name) {
  if (!name) return false;
  const trimmed = name.trim();
  const re = /^[A-Za-z\u0900-\u097F]+(?: [A-Za-z\u0900-\u097F]+)*$/;
  return re.test(trimmed);
}
function passwordRules(password) {
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const passed = Object.values(rules).filter(Boolean).length;
  return { rules, score: passed };
}
const Icon = ({ ok }) =>
  ok ? (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700">
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700">
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    </span>
  );
export default function ParentRegister() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const registerRef = useRef(null);
  const moreRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (registerRef.current && !registerRef.current.contains(event.target)) setRegisterOpen(false);
      if (moreRef.current && !moreRef.current.contains(event.target)) setMoreOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  
  const onKeyboardChange = (input) => {
  if (!activeInput) return;

  setFormData((prev) => ({
    ...prev,
    [activeInput]: input
  }));
};
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  const { i18n } = useTranslation();
  const isHindi = i18n.language === "hi";
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = validateEmail(formData.email);
  const phoneValid = validatePhone(formData.countryCode, formData.phone);
  const pw = passwordRules(formData.password);
  const passwordValid = pw.score === 4;
  const firstNameValid = validateName(formData.firstName);
  const lastNameValid = validateName(formData.lastName);

  const formValid =
    emailValid &&
    phoneValid &&
    passwordValid &&
    firstNameValid &&
    lastNameValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((s) => ({ ...s, [e.target.name]: true }));
  };

  const showError = (title, text) => {
    MySwal.fire({
      icon: "error",
      title,
      text,
      confirmButtonColor: "#8B5E3C",
    });
  };

  const showSuccess = (title, text) => {
    MySwal.fire({
      icon: "success",
      title,
      text,
      confirmButtonColor: "#8B5E3C",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!formValid) {
      showError(t("fixFields"), t("fillCorrect"));
      return;
    }

    setLoading(true);

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.replace(/\D/g, ""),
      password: formData.password,
    };

    try {
      const res = await fetch("http://localhost:5000/api/parents/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.msg || data.error || "Registration failed";
       showError(t("registrationFailed"), message);
        setLoading(false);
        return;
      }


      showSuccess(t("registered"), t("parentRegisteredSuccess"));
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
      });
      setTouched({});
      setSubmitAttempted(false);
      setLoading(false);
    } catch (error) {
      console.error("Parent registration network error:", error);
     showError(t("networkError"), t("tryLater"));
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-16 text-brown">
        <h2 className="text-4xl md:text-5xl mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#C79A63] via-[#8B5E3C] to-[#4B2E1E] font-extrabold tracking-wide leading-relaxed pt-2 pb-2">
          {t("parentRegistration")}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-brown/20 p-12 md:p-14 rounded-2xl shadow-2xl space-y-8 max-w-3xl mx-auto"
          noValidate
        >
          {/* Input Fields same as before */}
          <label className="relative">
            <div className="flex items-center justify-between mb-2 font-semibold text-sm uppercase text-brown/80">
              <span>{t("firstName")} <span className="text-red-600">*</span></span>
              <Icon ok={firstNameValid} />
            </div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => {
              const value = e.target.value.replace(/[^A-Za-z\u0900-\u097F ]/g, "");
              setFormData((prev) => ({
                ...prev,
                firstName: value
              }));
            }}
            onFocus={() => {
              setActiveInput("firstName");
              if (isHindi) setShowKeyboard(true);
            }}
              onBlur={handleBlur}
              required
              className={`w-full px-4 py-3 rounded-xl border ${ (touched.firstName || submitAttempted) && formData.firstName.trim().length === 0 ? "border-red-500" : "border-brown/50" } focus:outline-none focus:ring-2 focus:ring-brown/70`}
            />
            {(touched.firstName || submitAttempted) && formData.firstName.trim().length === 0 && (
              <p className="text-red-600 text-sm mt-1">{t("firstNameRequired")}</p>
            )}
          </label>

          <div>
            {/* Last Name */}
          <label className="relative">
            <div className="flex items-center justify-between mb-2 font-semibold text-sm uppercase text-brown/80">
              <span><span>{t("lastName")} <span className="text-red-600">*</span></span><span className="text-red-600">*</span></span>
              <Icon ok={lastNameValid} />
            </div>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => {
              const value = e.target.value.replace(/[^A-Za-z\u0900-\u097F ]/g, "");
              setFormData((prev) => ({
                ...prev,
                lastName: value
              }));
            }}
            onFocus={() => {
              setActiveInput("lastName");
              if (isHindi) setShowKeyboard(true);
            }}
              onBlur={handleBlur}
              required
              className={`w-full px-4 py-3 rounded-xl border ${ (touched.lastName || submitAttempted) && formData.lastName.trim().length === 0 ? "border-red-500" : "border-brown/50" } focus:outline-none focus:ring-2 focus:ring-brown/70`}
            />
            {(touched.lastName || submitAttempted) && formData.lastName.trim().length === 0 && (
              <p className="text-red-600 text-sm mt-1">{t("lastNameRequired")}</p>
            )}
          </label>
          </div>

          <div>
            <label className="relative">
            <div className="flex items-center justify-between mb-2 font-semibold text-sm uppercase text-brown/80">
              <span>{t("emailAddress")} <span className="text-red-600 text-xs">*</span></span>
              <Icon ok={formData.email.length === 0 ? false : emailValid} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-xl border ${ (touched.email || submitAttempted) && formData.email && !emailValid ? "border-red-500" : "border-brown/50" } focus:outline-none focus:ring-2 focus:ring-brown/70`}
            />
            {(submitAttempted && formData.email && !emailValid) && (
              <p className="text-red-600 text-sm mt-1">{t("validEmail")}</p>
            )}
          </label>
          </div>

          <div>
            <label className="relative">
            <div className="flex items-center justify-between mb-2 font-semibold text-sm uppercase text-brown/80">
              <span>{t("password")} <span className="text-red-600">*</span></span>
              <Icon ok={formData.password.length > 0 && passwordValid} />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full px-4 py-3 rounded-xl border ${ (touched.password || submitAttempted) && !passwordValid ? "border-red-500" : "border-brown/50" } focus:outline-none focus:ring-2 focus:ring-brown/70`}
              autoComplete="new-password"
            />
            <div className="mt-2 text-sm">
              <div>{t("passwordStrength")}<strong>{["Very weak","Weak","Okay","Good","Strong"][pw.score]}</strong></div>
              <ul className="ml-4 list-disc text-brown/70">
                <li  className={pw.rules.length ? "text-green-600" : "text-red-500"}>{t("min8")}</li>
                <li  className={pw.rules.length ? "text-green-600" : "text-red-500"}>{t("oneUpper")}</li>
                <li  className={pw.rules.length ? "text-green-600" : "text-red-500"}>{t("oneNumber")}</li>
                <li  className={pw.rules.length ? "text-green-600" : "text-red-500"}>{t("oneSpecial")}</li>
              </ul>
            </div>
          </label>
          </div>

          {/* Phone */}
          <label className="relative">
            <div className="flex items-center justify-between mb-2 font-semibold text-sm uppercase text-brown/80">
              <span>{t("phoneNumber")} <span className="text-red-600">*</span></span>
              <Icon ok={formData.phone.length > 0 && phoneValid} />
            </div>
            <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setFormData((prev) => ({
                  ...prev,
                  phone: value
                }));
              }}
              maxLength={10}
                
                onBlur={handleBlur}
                placeholder={t("enterPhone")}
                required
                className={`w-full px-4 py-3 rounded-xl border ${
                  (touched.phone || submitAttempted) && !phoneValid
                    ? "border-red-500"
                    : "border-brown/50"
                } focus:outline-none focus:ring-2 focus:ring-brown/70`}
                
              />
                          
            {(submitAttempted && !phoneValid) && (
              <p className="text-red-600 text-sm mt-1">{t("validPhone")}</p>
            )}
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 ${
              loading
                ? "bg-brown/40 cursor-not-allowed"
                : "bg-gradient-to-br from-[#B8860B] via-[#8B5A2B] to-[#3E2723] hover:scale-105"
            } text-cream font-bold rounded-full shadow-inner transition-all duration-500 tracking-wider`}
          >
            {loading ? t("registering") : t("register")}
          </button>
        </form>
      </main>
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
                  className="px-4 py-2 bg-brown text-white rounded-lg"
                >
                  कीबोर्ड बंद करें
                </button>
              </div>
            </div>
          )}
      <Footer />
    </div>
  );
}
