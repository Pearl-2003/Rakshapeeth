import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
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

export default function ContactUs() {
  const [showKeyboard, setShowKeyboard] = useState(false);
const [activeInput, setActiveInput] = useState(null);
  const { t,i18n } = useTranslation();
    // track currently focused input
  const CONTACT_INFO = [
  {
    emoji: "📍",
    title: t("visitUs"),
    short: t("visitShort"),
    full: t("visitFull"),
  },
  {
    emoji: "📧",
    title: t("emailUs"),
    short: t("emailShort"),
    full: t("emailFull"),
  },
  {
    emoji: "📞",
    title: t("callUs"),
    short: t("callShort"),
    full: t("callFull"),
  },
  {
    emoji: "🕐",
    title: t("officeHours"),
    short: t("officeShort"),
    full: t("officeFull"),
  },
   
];
const onKeyboardChange = (input) => {
  if (!activeInput) return;
  setFormData((prev) => ({ ...prev, [activeInput]: input }));
};
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [activeInfo, setActiveInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: t("msgSent"),
          text: t("msgSentDesc"),
          confirmButtonColor: "#8B5E3C",
        });

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: t("oops"),
          text: data.message || t("somethingWrong"),
          confirmButtonColor: "#8B5E3C",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("serverError"),
text: t("tryLater"),
        confirmButtonColor: "#8B5E3C",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9ede3] via-[#f5e3d1] to-[#e7c9a9] flex flex-col">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <AnimatePresence>
  {activeInfo && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setActiveInfo(null)}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-10 max-w-lg w-full shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveInfo(null)}
          className="absolute top-4 right-4 text-brown hover:scale-110 transition"
        >
          <X size={26} />
        </button>

        {/* Content */}
        <div className="text-6xl mb-4">{activeInfo.emoji}</div>
        <h3 className="text-2xl font-extrabold text-brown mb-4">
          {activeInfo.title}
        </h3>

        <pre className="whitespace-pre-wrap text-brown/80 leading-relaxed font-sans">
          {activeInfo.full}
        </pre>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-center mb-4 pt-2 leading-loose bg-clip-text text-transparent bg-gradient-to-r from-[#C79A63] via-[#8B5E3C] to-[#4B2E1E]"
        >
          {t("contactTitle")} 💬
        </motion.h2>

        <p className="text-center text-brown/70 max-w-2xl mx-auto mb-10 text-lg">
          {t("contactDesc")}
        </p>

        <div className="flex justify-center mb-14">
          {[
            { key: "info", label: `📞 ${t("contactInfo")}` },
{ key: "form", label: `✉️ ${t("contactForm")}` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-8 py-3 mx-2 rounded-full font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-[#8B5E3C] to-[#4B2E1E] text-white shadow-xl scale-105"
                  : "bg-white/70 hover:bg-white shadow-md"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {CONTACT_INFO.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveInfo(item)}
                  className="cursor-pointer bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="text-5xl mb-4">{item.emoji}</div>
                  <h3 className="text-xl font-bold text-brown mb-2">
                    {item.title}
                  </h3>
                  <p className="text-brown/70">{item.short}</p>
                  <p className="mt-4 text-sm text-brown/50 italic">
                    {t("tapExpand")}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "form" && (
            <motion.form
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto bg-white/70 backdrop-blur-xl p-12 rounded-3xl shadow-2xl space-y-6"
            >
              {[
              { name: "name", placeholder: `👤 ${t("yourName")}`, required: true },
              { name: "email", placeholder: `📧 ${t("emailAddress")}`, required: true },
              { name: "phone", placeholder: `📞 ${t("phoneNumber")}`, required: false },
              { name: "subject", placeholder: `📝 ${t("subject")}`, required: true },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                value={formData[field.name]}
                placeholder={field.placeholder}
                required={field.required}
                onFocus={() => {
                  setActiveInput(field.name); // active input for keyboard
                  if (i18n.language === "hi") setShowKeyboard(true); // show Hindi keyboard if active
                }}
                onChange={(e) => {
                  // Allow Hindi + English letters only
                  const value = e.target.value.replace(/[^A-Za-z\u0900-\u097F ]/g, "");
                  setFormData({ ...formData, [field.name]: value });
                }}
                onInvalid={(e) => e.target.setCustomValidity(t("fillField"))}
                onInput={(e) => e.target.setCustomValidity("")}
                className="w-full px-5 py-4 rounded-xl border border-brown/40 focus:outline-none focus:ring-2 focus:ring-brown shadow-sm"
              />
            ))}

              <textarea
                name="message"
                value={formData.message}
                placeholder={`💬 ${t("yourMessage")}`}
                required
                rows={5}
                onFocus={() => {
                  setActiveInput("message"); // active input for keyboard
                  if (i18n.language === "hi") setShowKeyboard(true); // show Hindi keyboard if active
                }}
                onChange={(e) => {
                  // Allow Hindi + English letters only
                  const value = e.target.value.replace(/[^A-Za-z\u0900-\u097F\s]/g, "");
                  setFormData({ ...formData, message: value });
                }}
                onInvalid={(e) => e.target.setCustomValidity(t("fillField"))}
                onInput={(e) => e.target.setCustomValidity("")}
                className="w-full px-5 py-4 rounded-xl border border-brown/40 focus:outline-none focus:ring-2 focus:ring-brown shadow-sm"
              />

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#B8860B] via-[#8B5A2B] to-[#3E2723] text-white font-bold text-lg tracking-wide hover:scale-105 transition-all shadow-xl"
              >
                {t("sendMessage")} 🚀
              </button>
            </motion.form>
            
          )}
        </AnimatePresence>
        {showKeyboard && (
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
