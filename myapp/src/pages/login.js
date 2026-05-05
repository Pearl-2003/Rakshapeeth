// src/pages/LoginPage.js
import React, { useState, useRef, useEffect } from "react";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState("admin");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const registerRef = useRef(null);
  const moreRef = useRef(null);
  const navigate = useNavigate();
  const [lang, setLang] = useState(i18n.language || "en");
  // Forgot-password modal state & flow
  const [fpOpen, setFpOpen] = useState(false);
  const [fpStep, setFpStep] = useState(1); // 1: enter, 2: verify OTP, 3: reset pw, 4: success
  const [identifier, setIdentifier] = useState(""); // email or id input
  const [detectedRole, setDetectedRole] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fpMessage, setFpMessage] = useState("");
const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.25 },
    },
  };

  // Role detection heuristic
  const detectRoleFromIdentifier = (id) => {
    const val = (id || "").toString().trim().toLowerCase();
    if (!val) return null;
    if (val.includes("@")) return "parent";
    if (val.startsWith("admin") || val.includes("admin")) return "admin";
    if (val.startsWith("guard") || val.includes("guard") || val.startsWith("grd"))
      return "guard";
    if (/^[0-9]+$/.test(val) || /\d/.test(val)) return "guard";
    return "parent";
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

// Send OTP
  const sendOtp = async () => {
  setFpMessage("");

  if (!identifier.trim()) {
    setFpMessage(
    role === "guard"
    ? t("pleaseEnterGuardId")
    : t("pleaseEnterEmail")
);
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        identifier: identifier.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setFpMessage(data.msg || t("failedSendOtp"));
      setLoading(false);
      return;
    }

    setFpStep(2);
    setFpMessage(t("otpSentMsg"));
    setOtpSent(true);
    setResendTimer(60);
  } catch (err) {
    setFpMessage(t("serverErrorMsg"));
  }

  setLoading(false);
};

// Resend OTP
const resendOtp = async () => {
  if (resendTimer > 0) return;

  setOtpInput("");
  await sendOtp();
};

  // Verify OTP
  const verifyOtp = async () => {
  setFpMessage("");

  if (!otpInput.trim()) {
    setFpMessage(t("enterOtp"));
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        identifier: identifier.trim(),
        otp: otpInput.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setFpMessage(data.msg || t("invalidOtp"));
      setLoading(false);
      return;
    }

    setFpStep(3);
    setFpMessage(t("otpVerified"));
  } catch (err) {
    setFpMessage(t("verificationFailed"));
  }

  setLoading(false);
};

  // Reset Password
  const resetPassword = async () => {
  setFpMessage("");

  if (!newPassword || !confirmPassword) {
    setFpMessage(t("fillAllFields"));
    return;
  }

  if (newPassword !== confirmPassword) {
    setFpMessage(t("passwordMismatch"));
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        identifier: identifier.trim(),
        newPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setFpMessage(data.msg || t("resetPasswordFailed"));
      setLoading(false);
      return;
    }

    setFpStep(4);
  } catch (err) {
    setFpMessage(t("serverErrorMsg"));
  }

  setLoading(false);
};

 const handleLogin = async () => {
  if (role === "admin") {
    if (!email || !password) {
Swal.fire({ icon: 'warning', title: t("missingFields"),
text: t("fillAll") });
return;
}
if (role === "admin") {
try {
const res = await fetch("http://localhost:5000/api/admin/login", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ email, password })
});
const data = await res.json();
if (res.ok)
  {
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("role", "admin");
Swal.fire({
  icon: 'success',
  title: 'Login Successful',
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 1200,
  timerProgressBar: true
});

navigate("/admin/dashboard");
}
 else {
Swal.fire({ icon: 'error', title: t("invalidCredentials"), text: data.message || 'Login failed' });
}
} catch (err) {
console.error("SERVER ERROR:", err);
Swal.fire({ icon: 'error', title: t("serverError"),
text: t("tryLater") });
}
}
  } else if (role === "guard") {

     if (!email) {
      Swal.fire({
        icon: "warning",
        title: t("missingFields"),
text: t("guardIdRequired"),
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/guard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guardId: email,password}),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: t("loginRecorded"),
        }).then(() => {
          localStorage.setItem("guardToken", data.token);

          localStorage.setItem("role", "guard");
          localStorage.setItem("guardId", email); // email = guardId
          navigate("/guard/dashboard");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: t("loginFailed"),
          text: data.msg,
        });
      }
    }
  catch (err) {
      console.error("SERVER ERROR:", err);
      Swal.fire({
        icon: "error",
        title: t("serverError"),
        text: t("tryLater"),
      });
  }
}
else if(role === "parent") {
    try {
      const res = await fetch("http://localhost:5000/api/parents/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  email: email.trim(),
  password: password.trim()
})
      });

      const data = await res.json();

       if (res.ok) {
        localStorage.setItem("parentToken", data.token);
          localStorage.setItem("role", "parent");
        Swal.fire({ icon: "success", title: "Login Successful" }).then(() => {
          
          navigate("/parent/dashboard");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: t("invalidCredentials"),
text: data.msg || t("loginFailed"),
        });
      }
    } catch (err) {
      console.error("SERVER ERROR:", err);
      Swal.fire({
        icon: "error",
        title: t("serverError"),
text: t("tryLater"),
      });
    }

  }
};


  return (
    <div className="font-sans bg-gradient-to-b from-cream to-cream/90 min-h-screen text-brown">
      {/* Header */}
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

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex flex-col items-center pt-24 px-6 pb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brown mb-8">
          {t("loginPortal")}
        </h1>

        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-4xl transition-all"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          {/* Role Tabs */}
          <div className="flex justify-between mb-6">
            {["admin", "guard", "parent"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all w-full mx-2 ${
                  role === r
                    ? "bg-[#7B4B2A] text-cream shadow-lg scale-105"
                    : "bg-cream text-[#7B4B2A] hover:shadow-md"
                }`}
              >
                {t(r)}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="mt-4 space-y-4">
                {role !== "parent" ? (
                  <>
                    <input
                      type="text"
                      placeholder={role === "admin" ? t("adminId") : t("guardId")}
                      value={email}
      onChange={(e) => setEmail(e.target.value)}  
                      className="w-full p-4 text-lg border border-[#7B4B2A]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 text-lg border border-[#7B4B2A]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]"
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="email"
                      placeholder={t("email")}
                      value={email}
  onChange={(e) => setEmail(e.target.value)} 
                      className="w-full p-4 text-lg border border-[#7B4B2A]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]"
                    />
                    <input
                      type="password"
                      placeholder={t("password")}
                      value={password}
  onChange={(e) => setPassword(e.target.value)} 
                      className="w-full p-4 text-lg border border-[#7B4B2A]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]"
                    />
                  </>
                )}

                <button
                  onClick={handleLogin}
                  className="w-full py-4 rounded-full bg-[#7B4B2A] text-cream font-bold text-lg hover:shadow-xl transition-all"
                >
                  {t("login")}
                </button>

                {/* Links */}
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => {
                      setFpOpen(true);
                      setFpStep(1);
                      setFpMessage("");
                      setIdentifier("");
                      setDetectedRole(null);
                    }}
                    className="text-sm text-[#7B4B2A] hover:underline"
                  >
                    {t("forgotPassword")}
                  </button>

                  {role !== "admin" ? (
                    <div className="text-sm">
                    {t("notRegistered")}{" "}
                    <Link
                      to={
                        role === "parent"
                          ? "/parent-registration"
                          : "/guard-registration"
                      }
                      className="text-[#7B4B2A] font-semibold hover:underline"
                    >
                      {t("registerAs", { role: t(role) })}
                    </Link>
                  </div>
                  ) : (
                    <div className="text-sm text-brown/50">
                      {t("adminRegNA")}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>

      <Footer />

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {fpOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setFpOpen(false)}
            />

            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10"
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{t("forgotTitle")}</h3>
                  <p className="text-sm text-brown/60 mt-1">
                   {t("forgotDesc")}
                  </p>
                </div>
                <button
                  onClick={() => setFpOpen(false)}
                  className="text-2xl text-brown/60 hover:text-brown transition"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5">
                {/* Step 1 */}
                {fpStep === 1 && (
                  <motion.div variants={formVariants} initial="hidden" animate="visible" exit="exit">
                    <label className="block text-sm mb-2 text-brown/70">
                      {t("emailOrId")}
                    </label>
                    <input
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={t("enterEmailId")}
                      className="w-full p-3 border border-[#7B4B2A]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-brown/60">{fpMessage}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setFpOpen(false)}
                          className="px-3 py-2 rounded-lg bg-cream/80 text-brown hover:opacity-90"
                        >
                          {t("cancel")}
                        </button>
                        <button
                          onClick={sendOtp}
                          disabled={loading}
                          className="px-4 py-2 rounded-lg bg-[#7B4B2A] text-cream font-semibold hover:shadow-lg"
                        >
                          {loading ? t("sending") : t("sendOtp")}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 */}
                {fpStep === 2 && (
                  <motion.div variants={formVariants} initial="hidden" animate="visible" exit="exit">
                    <div className="mb-2 text-sm text-brown/70">
                      {t("otpInstruction")}
                    </div>
                    <input
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder={t("enterOtp")}
                      className="w-full p-3 text-lg border border-[#7B4B2A]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-sm text-brown/60">{fpMessage}</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setFpStep(1);
                            setFpMessage("");
                            setOtpInput("");
                          }}
                          className="px-3 py-2 rounded-lg bg-cream/80 text-brown hover:opacity-90"
                        >
                          {t("back")}
                        </button>
                        <button
                          onClick={verifyOtp}
                          disabled={loading}
                          className="px-4 py-2 rounded-lg bg-[#7B4B2A] text-cream font-semibold hover:shadow-lg"
                        >
                          {loading ? t("verifying") : t("verifyOtp")}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <div className="text-brown/60">{t("didntReceiveOtp")}</div>
                      <button
                        onClick={resendOtp}
                        disabled={resendTimer > 0 || loading}
                        className="text-[#7B4B2A] font-semibold"
                      >
                        {resendTimer > 0
                          ? `${t("resendIn")} ${resendTimer}s`
                          : t("resendOtp")}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 */}
                {fpStep === 3 && (
                  <motion.div variants={formVariants} initial="hidden" animate="visible" exit="exit">
                    <div className="mb-2 text-sm text-brown/70">
                      {t("setNewPassword")}
                    </div>
                    <input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                      placeholder={t("newPassword")}
                      className="w-full p-3 border border-[#7B4B2A]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]"
                    />
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type="password"
                      placeholder={t("confirmPassword")}
                      className="w-full p-3 mt-3 border border-[#7B4B2A]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-brown/60">{fpMessage}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setFpStep(2);
                            setFpMessage("");
                          }}
                          className="px-3 py-2 rounded-lg bg-cream/80 text-brown hover:opacity-90"
                        >
                          Back
                        </button>
                        <button
                          onClick={resetPassword}
                          disabled={loading}
                          className="px-4 py-2 rounded-lg bg-[#7B4B2A] text-cream font-semibold hover:shadow-lg"
                        >
                          {loading ? t("saving") : t("savePassword")}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4 */}
                {fpStep === 4 && (
                  <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-center py-6"
                  >
                    <div className="text-3xl">✅</div>
                    <div className="mt-3 font-semibold">
                      {t("resetSuccess")}
                    </div>
                    <div className="mt-2 text-sm text-brown/60">
                      {t("loginWithNew")}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
       )} </AnimatePresence> </div> ); }

