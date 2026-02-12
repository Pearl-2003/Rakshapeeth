// src/pages/LoginPage.js
import React, { useState, useRef, useEffect } from "react";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState("admin");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const registerRef = useRef(null);
  const moreRef = useRef(null);
  const navigate = useNavigate();

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

  // Simulated OTP sending
  const sendOtp = async () => {
    setFpMessage("");
    const val = identifier.trim();
    if (!val) {
      setFpMessage("Please enter your registered Email / ID.");
      return;
    }

    const roleDetected = detectRoleFromIdentifier(val);
    setDetectedRole(roleDetected);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setResendTimer(60);
    setFpStep(2);
    setFpMessage(
      "OTP sent to registered Email & Phone (if available). Use the code received to verify."
    );

    console.log(`[DEV] OTP for ${val} (${roleDetected}):`, otp);
    setLoading(false);
  };

  const verifyOtp = async () => {
    setFpMessage("");
    if (!otpInput.trim()) {
      setFpMessage("Enter the OTP you received.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    if (otpInput.trim() === generatedOtp) {
      setFpStep(3);
      setFpMessage("OTP verified — set your new password.");
      setOtpInput("");
    } else {
      setFpMessage("Invalid OTP. Please check and try again.");
    }
    setLoading(false);
  };

  const resendOtp = async () => {
    if (resendTimer > 0) return;
    setFpMessage("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setResendTimer(60);
    setFpMessage("A new OTP was sent.");
    console.log(`[DEV] Resent OTP for ${identifier}:`, otp);
    setLoading(false);
  };

  const resetPassword = async () => {
    setFpMessage("");
    if (!newPassword || !confirmPassword) {
      setFpMessage("Please fill both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFpMessage("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setFpMessage("Password should be at least 6 characters.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    setFpStep(4);
    setFpMessage("Password updated successfully!");
    setLoading(false);

    setTimeout(() => {
      setFpOpen(false);
      setFpStep(1);
      setIdentifier("");
      setDetectedRole(null);
      setGeneratedOtp(null);
      setOtpInput("");
      setNewPassword("");
      setConfirmPassword("");
      setFpMessage("");
    }, 900);
  };

 const handleLogin = async () => {
  if (role === "admin") {
    if (!email || !password) {
Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Please fill all fields' });
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
if (res.ok) {
Swal.fire({ icon: 'success', title: 'Login Successful' }).then(() => {
localStorage.setItem("adminToken", data.token);
navigate("/admin/dashboard");
});
} else {
Swal.fire({ icon: 'error', title: 'Invalid Credentials', text: data.message || 'Login failed' });
}
} catch (err) {
console.error("SERVER ERROR:", err);
Swal.fire({ icon: 'error', title: 'Server Error', text: 'Please try again later' });
}
}
  } else if (role === "guard") {

     if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Missing Field",
        text: "Please enter Guard ID",
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
          title: "Login Recorded",
        }).then(() => {
          localStorage.setItem("guardToken", data.token);

          localStorage.setItem("role", "guard");
localStorage.setItem("guardId", email); // email = guardId
          navigate("/guard/dashboard");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.msg,
        });
      }
    }
  catch (err) {
      console.error("SERVER ERROR:", err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Try again later",
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
        Swal.fire({ icon: "success", title: "Login Successful" }).then(() => {
          localStorage.setItem("parentToken", data.token);
          navigate("/parent/dashboard");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid Credentials",
          text: data.msg || "Login failed",
        });
      }
    } catch (err) {
      console.error("SERVER ERROR:", err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Please try again later",
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
          Login Portal
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
                {r.charAt(0).toUpperCase() + r.slice(1)}
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
                      placeholder={role === "admin" ? "Admin ID" : "Guard ID"}
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
                      placeholder="Email"
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
                )}

                <button
                  onClick={handleLogin}
                  className="w-full py-4 rounded-full bg-[#7B4B2A] text-cream font-bold text-lg hover:shadow-xl transition-all"
                >
                  Login
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
                    Forgot Password?
                  </button>

                  {role !== "admin" ? (
                    <div className="text-sm">
                      Not registered?{" "}
                      <Link
                        to={
                          role === "parent"
                            ? "/parent-registration"
                            : "/guard-registration"
                        }
                        className="text-[#7B4B2A] font-semibold hover:underline"
                      >
                        Register as{" "}
                        {role === "parent" ? "Parent" : "Guard"}
                      </Link>
                    </div>
                  ) : (
                    <div className="text-sm text-brown/50">
                      Admin registration not available
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
                  <h3 className="text-2xl font-bold">Forgot Password</h3>
                  <p className="text-sm text-brown/60 mt-1">
                    Enter your registered Email / ID to receive an OTP.
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
                      Email / ID
                    </label>
                    <input
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter your registered Email / ID"
                      className="w-full p-3 border border-[#7B4B2A]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-brown/60">{fpMessage}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setFpOpen(false)}
                          className="px-3 py-2 rounded-lg bg-cream/80 text-brown hover:opacity-90"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={sendOtp}
                          disabled={loading}
                          className="px-4 py-2 rounded-lg bg-[#7B4B2A] text-cream font-semibold hover:shadow-lg"
                        >
                          {loading ? "Sending..." : "Send OTP"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 */}
                {fpStep === 2 && (
                  <motion.div variants={formVariants} initial="hidden" animate="visible" exit="exit">
                    <div className="mb-2 text-sm text-brown/70">
                      We sent an OTP. Enter it below.
                    </div>
                    <input
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter 6-digit OTP"
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
                          Back
                        </button>
                        <button
                          onClick={verifyOtp}
                          disabled={loading}
                          className="px-4 py-2 rounded-lg bg-[#7B4B2A] text-cream font-semibold hover:shadow-lg"
                        >
                          {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <div className="text-brown/60">Didn't receive OTP?</div>
                      <button
                        onClick={resendOtp}
                        disabled={resendTimer > 0 || loading}
                        className="text-[#7B4B2A] font-semibold"
                      >
                        {resendTimer > 0
                          ? `Resend in ${resendTimer}s`
                          : "Resend OTP"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 */}
                {fpStep === 3 && (
                  <motion.div variants={formVariants} initial="hidden" animate="visible" exit="exit">
                    <div className="mb-2 text-sm text-brown/70">
                      Set a new secure password.
                    </div>
                    <input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                      placeholder="New password"
                      className="w-full p-3 border border-[#7B4B2A]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B4B2A]"
                    />
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type="password"
                      placeholder="Confirm new password"
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
                          {loading ? "Saving..." : "Save Password"}
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
                      Password reset successful
                    </div>
                    <div className="mt-2 text-sm text-brown/60">
                      You can now login with your new password.
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
       )} </AnimatePresence> </div> ); }
