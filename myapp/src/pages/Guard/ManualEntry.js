import Swal from "sweetalert2";
import axios from "axios";
import HeaderNavbar from "../../components/HeaderNavbar3";
import Sidebar2 from "../../components/Sidebar2";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import React, { useState, useEffect } from "react";
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
export default function ManualEntryForm() {
  const { t,i18n } = useTranslation();
const isHindi = i18n.language === "hi";
useEffect(() => {
  const savedLang = localStorage.getItem("language");
  if (savedLang) {
    i18n.changeLanguage(savedLang);
  }
}, [i18n]);
const [showKeyboard, setShowKeyboard] = useState(false);
const [activeInput, setActiveInput] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const validateName = (name) => /^[A-Za-z\s]{3,50}$/.test(name.trim());
  const validateVehicle = (vehicle) =>
  /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/.test(vehicle.replace(/\s+/g, "").toUpperCase());
  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    vehicleNo: "",
    idProof: "",
    idProofNumber: "",
    reasonOfVisit: "",
    otherReason: ""
  });
  const onKeyboardChange = (input) => {
  if (!activeInput) return;

  setFormData((prev) => ({
    ...prev,
    [activeInput]: input
  }));
  
};

  /* ---------------- VALIDATIONS ---------------- */
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const validateAadhaar = (value) => /^[0-9]{12}$/.test(value);
  const validatePAN = (value) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
  const validateDL = (value) =>
    /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/.test(value.replace(/\s+/g, ""));

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Visitor Name Validation
  if (!formData.name.trim()) {
    return Swal.fire(t("missingField"), t("visitorNameRequired"), "error");
  }
  // Vehicle validation if entered
if (formData.vehicleNo && !validateVehicle(formData.vehicleNo)) {
  return Swal.fire(t("invalidVehicle"), t("vehicleFormat"), "error");
}

// Name length validation
if (!validateName(formData.name)) {
  return Swal.fire(t("invalidName"), t("name3to50Chars"), "error");
}
  // Phone Validation
  if (!validatePhone(formData.phoneNo)) {
    return Swal.fire(t("invalidPhone"), t("valid10DigitPhone"), "error");
  }

  // ID Proof Validation
  if (!formData.idProof) {
    return Swal.fire(t("missingField"), t("selectIdProof"), "error");
  }

  // ID Number Validation
  if (!formData.idProofNumber.trim()) {
    return Swal.fire(t("missingField"), t("enterIdNumber"), "error");
  }

  // Aadhaar Validation
  if (
    formData.idProof === "Aadhaar" &&
    !validateAadhaar(formData.idProofNumber)
  ) {
    return Swal.fire(t("invalidAadhaar"), t("aadhaar12Digits"), "error");
  }

  // PAN Validation
  if (formData.idProof === "PAN" && !validatePAN(formData.idProofNumber)) {
    return Swal.fire(t("invalidPan"), t("panFormat"), "error");
  }

  // Driving License Validation
  if (formData.idProof === "DL" && !validateDL(formData.idProofNumber)) {
    return Swal.fire(t("invalidDL"), t("invalidDLFormat"), "error");
  }

  // Visit Reason Validation
  if (!formData.reasonOfVisit) {
    return Swal.fire(t("missingField"), t("selectVisitReason"), "error");
  }

  // Other / Alumni Reason Validation
  if (
    (formData.reasonOfVisit === "Other" ||
      formData.reasonOfVisit === "Alumni") &&
    !formData.otherReason.trim()
  ) {
    return Swal.fire(t("missingField"), t("specifyReason"), "error");
  }

  // Payload
  const payload = {
    name: formData.name,
    phoneNo: formData.phoneNo,
    vehicleNo: formData.vehicleNo || null,
    idProof: formData.idProof,
    idProofNumber: formData.idProofNumber,
    reasonOfVisit: formData.reasonOfVisit,
    otherReason:
      formData.reasonOfVisit === "Other" ||
      formData.reasonOfVisit === "Alumni"
        ? formData.otherReason
        : ""
  };

  try {
    const token = localStorage.getItem("guardToken");

    const res = await axios.post(
      "http://localhost:5000/api/manual-entry",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Success Alert
    Swal.fire({
      icon: "success",
      title: t("success"),
      text: t("visitorEntrySuccess"),
      timer: 2000,
      showConfirmButton: false
    });

    // Reset Form
    setFormData({
      name: "",
      phoneNo: "",
      vehicleNo: "",
      idProof: "",
      idProofNumber: "",
      reasonOfVisit: "",
      otherReason: ""
    });

  } catch (error) {
    console.error("Manual entry error:", error);

    Swal.fire({
      icon: "error",
      title: t("error"),
      text:
        error.response?.data?.message ||
        t("somethingWentWrong")
    });
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4efe9] to-[#ece1d6]">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex">
        <Sidebar2 sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 flex justify-center p-10">
          <form
            onSubmit={handleSubmit}
            className="
              w-full max-w-5xl
              bg-white
              rounded-[2.5rem]
              shadow-[0_35px_90px_rgba(0,0,0,0.15)]
              p-14
              space-y-14
              border border-gray-200
            "
          >
            {/* HEADER */}
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-extrabold text-[#5C3A21]">
                {t("manualVisitorEntry")}
              </h2>
              <p className="text-gray-600 text-lg">
                {t("guardAssistedEntry")}
              </p>
              <div className="h-1 w-28 mx-auto bg-[#8B5E3C]/50 rounded-full" />
            </div>

            {/* VISITOR DETAILS */}
            <section className="bg-[#faf7f4] p-8 rounded-2xl border space-y-6">
              <h3 className="text-xl font-bold text-[#5C3A21]">👤 {t("visitorDetails")}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                    name="name"
                    placeholder={t("visitorName")}
                    value={formData.name}
                    onFocus={() => {
                      setActiveInput("name");
                      if (isHindi) setShowKeyboard(true);
                    }}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value.replace(/[^A-Za-z\u0900-\u097F ]/g, "")
                      })
                    }
                    className="input-modern"
                  />
                <input
                    name="phoneNo"
                    placeholder={t("phoneNumber")}
                    value={formData.phoneNo}
                    maxLength={10}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phoneNo: e.target.value.replace(/\D/g, "")
                      })
                    }
                    className="input-modern"
                  />
              </div>
            </section>

            {/* VEHICLE */}
            <section className="bg-[#faf7f4] p-8 rounded-2xl border space-y-4">
              <h3 className="text-xl font-bold text-[#5C3A21]">🚗 {t("vehicleOptional")}</h3>

             <div>
              <input
                name="vehicleNo"
                placeholder={t("vehicleNumber")}
                value={formData.vehicleNo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehicleNo: e.target.value.toUpperCase()
                  })
                }
                className="input-modern"
              />

              <p className="text-sm text-gray-500 mt-1">
                {t("leaveEmptyWalkingVisitor")}
              </p>
</div>
            </section>

            {/* ID VERIFICATION */}
            <section className="bg-[#faf7f4] p-8 rounded-2xl border space-y-6">
              <h3 className="text-xl font-bold text-[#5C3A21]">🪪 {t("identityVerification")}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select
                  name="idProof"
                  value={formData.idProof}
                  onChange={handleChange}
                  className="input-modern"
                >
                  <option value="">{t("selectIdProof")}</option>
                  <option value="Aadhaar">{t("aadhaar")}</option>
                  <option value="PAN">{t("pan")}</option>
                  <option value="DL">{t("drivingLicense")}</option>
                </select>

                <input
                  name="idProofNumber"
                  placeholder={t("idNumber")}
                  value={formData.idProofNumber}
                  onChange={handleChange}
                  className="input-modern"
                />
              </div>
            </section>

            {/* VISIT REASON */}
            <section className="bg-[#faf7f4] p-8 rounded-2xl border space-y-6">
              <h3 className="text-xl font-bold text-[#5C3A21]">📋 {t("visitInformation")}</h3>

              <select
                name="reasonOfVisit"
                value={formData.reasonOfVisit}
                onChange={handleChange}
                className="input-modern"
              >
                <option value="">{t("selectReason")}</option>
                <option value="Delivery">{t("delivery")}</option>
                <option value="Maintenance">{t("maintenance")}</option>
                <option value="Official Work">{t("officialWork")}</option>
                <option value="Parent / Guardian">{t("parentGuardian")}</option>
                <option value="Alumni">{t("alumni")}</option>
                <option value="Other">{t("other")}</option>
              </select>

              {(formData.reasonOfVisit === "Other" ||
                formData.reasonOfVisit === "Alumni") && (
                <input
                    name="otherReason"
                    placeholder={t("specifyReason")}
                    value={formData.otherReason}
                    onFocus={() => {
                      setActiveInput("otherReason");
                      if (isHindi) setShowKeyboard(true);
                    }}
                    onChange={handleChange}
                    className="input-modern"
                  />
              )}
            </section>

            {/* SUBMIT */}
            <button
              type="submit"
              className="
                w-full py-6
                rounded-full
                text-xl font-extrabold
                text-white
                bg-gradient-to-r from-[#8B5E3C] to-[#6B4226]
                shadow-[0_25px_60px_rgba(139,94,60,0.45)]
                hover:scale-[1.03]
                transition-all
              "
            >
              {t("saveManualEntry")}
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
        className="px-4 py-2 bg-[#8B5E3C] text-white rounded-lg"
      >
        कीबोर्ड बंद करें
      </button>
    </div>
  </div>
)}
      </div>
              
      <Footer />
    </div>
  );
}
