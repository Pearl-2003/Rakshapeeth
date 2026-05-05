// src/pages/PreVisit.js

import React, { useState, useRef, useEffect } from "react";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

// Phone validation function
function validatePhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10;
}

// ⭐ NEW: Validate Indian ID formats
function validateID(idType, idNumber) {
  idNumber = idNumber.trim();

  const patterns = {
    PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // ABCDE1234F
    AADHAAR: /^[0-9]{12}$/, // 12 digits
    DL: /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/ // MH142011234567
  };

  return patterns[idType]?.test(idNumber) || false;
}

export default function PreVisit() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isHindi, setIsHindi] = useState(false);
  const registerRef = useRef(null);
  const moreRef = useRef(null);

  const { t } = useTranslation();
const [showKeyboard, setShowKeyboard] = useState(false);
const [activeInput, setActiveInput] = useState(null);

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

  let value = input;

  // Remove numbers for name fields
  if (
    activeInput === "visitorName" ||
    activeInput === "studentName" ||
    activeInput === "otherReason" ||
    activeInput.startsWith("companions")
  ) {
    value = input.replace(/[0-9]/g, "");
  }

  // Update formData
  if (activeInput.startsWith("companions")) {
    const parts = activeInput.split("-");
    const index = Number(parts[1]);
    const field = parts[2]; // name or phone
    const updated = [...formData.companions];
    updated[index][field] = value;
    setFormData({ ...formData, companions: updated });
  } else {
    setFormData({ ...formData, [activeInput]: value });
  }
};

const onInputFocus = (field) => {
  setActiveInput(field);
  setShowKeyboard(true);
};
  const [formData, setFormData] = useState({
    visitorName: "",
    studentName: "",
    studentId: "",
    idProofType: "",
    visitorIdProof: "",
    vehicleType: "",        // ⭐ NEW
    vehicleNumber: "",
      // ⭐ NEW (Public Transport fields)
  driverName: "",
  driverPhone: "",
  driverVehicleNumber: "",
    dateOfVisit: "",
    numberOfPeople: "",
    companions: [],         // ⭐ NEW
    reasonOfVisit: "",
    otherReason: "",
    phoneNumber: "",
  });

 const handleNumberOfPeopleChange = (e) => {
  const count = Number(e.target.value);

  let companions = [];

  if (count > 0) {
    companions = [...(formData.companions || [])];

    if (count > companions.length) {
      for (let i = companions.length; i < count; i++) {
        companions.push({ name: "", phone: "" });
      }
    } else {
      companions = companions.slice(0, count);
    }
  }

  setFormData({
    ...formData,
    numberOfPeople: count,
    companions,
  });
};
  const handleCompanionChange = (index, field, value) => {
    const updated = [...formData.companions];
    updated[index][field] = value;

    setFormData({
      ...formData,
      companions: updated,
    });
  };
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (registerRef.current && !registerRef.current.contains(event.target)) setRegisterOpen(false);
      if (moreRef.current && !moreRef.current.contains(event.target)) setMoreOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value
  }));
};

  const reasonOptions = [
  { value: "", label: t("previsit.selectReason") },
  { value: "Academic Inquiry", label: t("previsit.reason.academic") },
  { value: "Meet Child", label: t("previsit.reason.meetChild") },
  { value: "Delivery / Parcel", label: t("previsit.reason.delivery") },
  { value: "Meeting Faculty", label: t("previsit.reason.meetingFaculty") },
  { value: "Alumini", label: t("previsit.reason.alumni") },
  { value: "Other", label: t("previsit.reason.other") },
];

  const phoneValid = validatePhone(formData.phoneNumber);

  // ⭐ UPDATED FORM VALIDATION
  const formValid =
  formData.visitorName.trim() !== "" &&
  formData.idProofType.trim() !== "" &&
  formData.visitorIdProof.trim() !== "" &&
  validateID(formData.idProofType, formData.visitorIdProof) &&
  formData.dateOfVisit.trim() !== "" &&
  formData.reasonOfVisit.trim() !== "" &&   // dropdown must have any value
  phoneValid &&
  Number(formData.numberOfPeople) >= 0 &&
  (
    formData.reasonOfVisit === "Other"   // only if "Other" selected
      ? (formData.otherReason && formData.otherReason.trim() !== "")
      : true
  );

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitAttempted(true);

  const errors = [];

  // ===== COMMON VALIDATION =====
  if (!formData.visitorName.trim()) {
  errors.push(t("previsit.errors.visitorNameRequired"));
} else if (/\d/.test(formData.visitorName)) {
  errors.push(t("previsit.errors.visitorNameNoNumbers"));
}

 // ⭐ Student ID OPTIONAL
if (formData.studentId.trim()) {
  // If studentId is entered, studentName should also be entered
  if (!formData.studentName.trim()) {
    errors.push(t("previsit.errors.studentNameRequired"));
  }
}

  if (!formData.idProofType.trim())
    errors.push(t("previsit.errors.idProofTypeRequired"));
  if (formData.vehicleType === "Private" && !formData.vehicleNumber.trim()) {
  errors.push(t("previsit.errors.vehicleNumberRequired"));
}
  if (!formData.visitorIdProof.trim())
    errors.push(t("previsit.errors.visitorIdProofRequired"));

  if (
    formData.idProofType &&
    !validateID(formData.idProofType, formData.visitorIdProof)
  ) {
    errors.push(`Invalid ${formData.idProofType} format`);
  }
  // Optional: studentName diya hai but studentId nahi
if (formData.studentName.trim() && !formData.studentId.trim()) {
  errors.push(t("previsit.errors.studentIdRequired"));
}

// ⭐ Public Transport Validation
if (formData.vehicleType === "Public") {
  if (!formData.driverName.trim()) {
    errors.push("Driver name is required");
  } else if (/\d/.test(formData.driverName)) {
    errors.push("Driver name cannot contain numbers");
  }

  if (!validatePhone(formData.driverPhone)) {
    errors.push("Driver phone number is invalid");
  }

  if (!formData.driverVehicleNumber.trim()) {
    errors.push("Driver vehicle number is required");
  }
}
  if (formData.dateOfVisit) {
  const today = new Date();
  const visitDate = new Date(formData.dateOfVisit);
  today.setHours(0,0,0,0); // ignore time
  if (visitDate < today) {
    errors.push(t("previsit.errors.dateInPast"));
  }
}

  if (!formData.reasonOfVisit.trim())
    errors.push(t("previsit.errors.reasonOfVisitRequired"));

  if (formData.reasonOfVisit === "Other" && !formData.otherReason.trim()) {
    errors.push(t("previsit.errors.otherReasonRequired"));
  }

  if (!phoneValid){
    errors.push(t("previsit.errors.phoneInvalid"));
  }

  if (formData.numberOfPeople === "" || Number(formData.numberOfPeople) < 0) {
    errors.push(t("previsit.errors.numPeople"));
  }
if (Number(formData.numberOfPeople) > 0) {
  (formData.companions || []).forEach((c, i) => {
    if (!c.name.trim()) {
      errors.push(`Companion ${i + 1} name is required`);
    } else if (/\d/.test(c.name)) {
      errors.push(`Companion ${i + 1} name cannot contain numbers`);
    }

    if (!validatePhone(c.phone)) {
      errors.push(`Companion ${i + 1} phone is invalid`);
    }
  });
}
  

  if (errors.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Form Incomplete",
      html: errors.map((err) => `<p>${err}</p>`).join(""),
      confirmButtonColor: "#8B5E3C",
    });
    return;
  }

  try {
    // =====================================================
    // 🔥 STEP 1: CHECK STUDENT ID EXISTENCE
    // =====================================================
    if (formData.studentId.trim()) {
  const studentCheck = await fetch(
    `http://localhost:4000//api/students/check/${formData.studentId}`
  );

  if (!studentCheck.ok) {
    Swal.fire({
      icon: "error",
      title: "Invalid Student ID",
      text: "❌ No such student ID exists in records",
      confirmButtonColor: "#8B5E3C",
    });
    return;
  }
}

    let response;

    // =====================================================
    // 🔹 CASE 1: Reason = Other → REQUEST SCHEMA
    // =====================================================
    if (formData.reasonOfVisit === "Other") {
      const requestPayload = {
      visitorName: formData.visitorName,
      studentName: formData.studentName,
      studentId: formData.studentId,
      idProofType: formData.idProofType,
      visitorIdProof: formData.visitorIdProof,
      vehicleType: formData.vehicleType,      // ⭐ NEW
      vehicleNumber: formData.vehicleNumber?.toUpperCase() || "",
      driverName: formData.driverName,
      driverPhone: formData.driverPhone,
      driverVehicleNumber: formData.driverVehicleNumber,
      companions: formData.companions,        // ⭐ NEW
      dateOfVisit: formData.dateOfVisit,
      numberOfPeople: Number(formData.numberOfPeople),
      reasonOfVisit: "Other",
      otherReason: formData.otherReason,
      phoneNumber: formData.phoneNumber,
      type: "non-parent"
    };
      response = await fetch(
        "http://localhost:5000/api/requests/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
        }
      );
    }

    // =====================================================
    // 🔹 CASE 2: Reason ≠ Other → OCCASIONAL VISITOR
    // =====================================================
    else {
      const occasionalPayload = {
      visitorName: formData.visitorName,
      driverName: formData.driverName,
      driverPhone: formData.driverPhone,
      driverVehicleNumber: formData.driverVehicleNumber,
      noOfCompanions: Number(formData.numberOfPeople),
      companions: formData.companions,      // ⭐ NEW
      vehicleType: formData.vehicleType,    // ⭐ NEW
      vehicleNo: formData.vehicleNumber?.toUpperCase() || "",
      visitorType: "Non-Parent",
      reason: formData.reasonOfVisit,
      phoneNumber: formData.phoneNumber,
      dateOfVisit: formData.dateOfVisit
    };
    console.log("Payload:", occasionalPayload);
      response = await fetch(
        "http://localhost:5000/api/occasional-visitors",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(occasionalPayload),
        }
      );
    }

    const data = await response.json();
    if (response.status === 409) {
  Swal.fire({
    icon: "info",
    title: "Request Already Made",
    text: data.message || "You have already submitted a request for this date.",
    confirmButtonColor: "#8B5E3C",
  });
  return; // 🚫 STOP further execution
}
    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Form Submitted!",
        text: "🎉 Your pre-visit request has been submitted successfully.",
        confirmButtonColor: "#8B5E3C",
      });

      setFormData({
        visitorName: "",
        studentName: "",
        studentId: "",
        idProofType: "",
        visitorIdProof: "",
        vehicleType: "",
        vehicleNumber: "",
        // ⭐ NEW (Public Transport fields)
        driverName: "",
        driverPhone: "",
        driverVehicleNumber: "",
        dateOfVisit: "",
        numberOfPeople: "",
        companions: [],
        reasonOfVisit: "",
        otherReason: "",
        phoneNumber: "",
      });

      setSubmitAttempted(false);
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: data.message || data.error || "Something went wrong",
        confirmButtonColor: "#8B5E3C",
      });
    }
  } catch (err) {
    console.error("❌ Submission error:", err);
    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: "Network or server error",
      confirmButtonColor: "#8B5E3C",
    });
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

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-16 text-brown">
        <h2 className="text-6xl md:text-7xl font-extrabold mb-6 text-[#7B4B2A] tracking-wide drop-shadow-sm text-center">
          {t("previsit.title")}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-brown/20 p-12 md:p-14 rounded-3xl shadow-2xl space-y-8 max-w-3xl mx-auto hover:shadow-3xl transition-all duration-500"
        >
          {/* Visitor Name */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              {t("previsit.visitorName")} <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="visitorName"
              value={formData.visitorName}
              onChange={handleChange}
              onFocus={() => onInputFocus("visitorName")}
              placeholder={t("previsit.visitorplaceholderName")}
              className="w-full px-4 py-3 rounded-xl border border-brown/50"
            />
          </div>
          {/* Student Name */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              {t("previsit.studentName")}
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              onFocus={() => onInputFocus("studentName")}
              placeholder={t("previsit.studentplaceholderName")}
              className="w-full px-4 py-3 rounded-xl border border-brown/50"
            />
            
          </div>
          
          {/* Student ID */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              {t("previsit.studentId")}
            </label>
            <input
              type="text"
              placeholder={t("previsit.studentplaceholderId")}
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50"
            />
            
          </div>

          {/* ID Proof Type */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              {t("previsit.idProofType")} <span className="text-red-600">*</span>
            </label>
            <select
              name="idProofType"
              value={formData.idProofType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300 bg-white"
            >
              <option value="">{t("previsit.selectIdProof")}</option>
              <option value="PAN">{t("pan")}</option>
              <option value="AADHAAR">{t("aadhaar")}</option>
              <option value="DL">{t("drivingLicense")}</option>
            </select>
            {submitAttempted && !formData.idProofType.trim() && (
              <p className="text-red-600 text-sm mt-1">{t("previsit.errors.selectIdProof")}</p>
            )}
          </div>

          {/* Visitor ID Proof */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              {t("previsit.idProofNumber")} <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder={t("previsit.idNumberPlaceholder")}
              name="visitorIdProof"
              value={formData.visitorIdProof}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300"
            />
            {submitAttempted &&
              formData.idProofType &&
              !validateID(formData.idProofType, formData.visitorIdProof) && (
                <p className="text-red-600 text-sm mt-1">
                   {t("previsit.errors.invalidId", { type: formData.idProofType })}
                </p>
              )}
          </div>
            {/* Vehicle Type */}
            <div>
              <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
                {t("previsit.vehicleType")}
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-brown/50 bg-white"
              >
                <option value="">{t("previsit.selectVehicleType")}</option>
                <option value="Private">{t("previsit.privateVehicle")}</option>
                <option value="Public">{t("previsit.publicTransport")}</option>
                <option value="None">{t("previsit.withoutVehicle")}</option>
              </select>
            </div>
                    {/* Vehicle Number */}
            {formData.vehicleType === "Private" && (
              <div>
                <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
                  {t("previsit.vehicleNumber")}
                </label>
                <input
                  type="text"
                  placeholder={t("previsit.vehicleNumberPlaceholder")}
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-brown/50"
                />
              </div>
            )}

          {/* ⭐ Public Transport Driver Details */}
{formData.vehicleType === "Public" && (
  <div className="space-y-4">
    
    <div>
      <label className="block mb-2 font-semibold text-sm text-brown/80">
        Driver Name
      </label>
      <input
        type="text"
        name="driverName"
        value={formData.driverName}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-xl border border-brown/50"
      />
    </div>

    <div>
      <label className="block mb-2 font-semibold text-sm text-brown/80">
        Driver Phone Number
      </label>
      <input
        type="tel"
        name="driverPhone"
        value={formData.driverPhone}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-xl border border-brown/50"
      />
    </div>

    <div>
      <label className="block mb-2 font-semibold text-sm text-brown/80">
        Vehicle Number
      </label>
      <input
        type="text"
        name="driverVehicleNumber"
        value={formData.driverVehicleNumber}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-xl border border-brown/50"
      />
    </div>

  </div>
)}
          {/* ⭐ NEW: Date of Visit */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              {t("previsit.dateOfVisit")} <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              name="dateOfVisit"
              value={formData.dateOfVisit}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300 bg-white"
            />
            {submitAttempted && !formData.dateOfVisit.trim() && (
              <p className="text-red-600 text-sm mt-1">{t("previsit.errors.selectDate")}</p>
            )}
          </div>

          {/* Reason of Visit */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              {t("previsit.reasonOfVisit")} <span className="text-red-600">*</span>
            </label>
            <select
              name="reasonOfVisit"
              value={formData.reasonOfVisit}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300 bg-white"
            >
              {reasonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {submitAttempted && !formData.reasonOfVisit && (
              <p className="text-red-600 text-sm mt-1">{t("previsit.errors.selectReason")}</p>
            )}
          </div>

          {/* Other / Alumini Reason */}
          {(formData.reasonOfVisit === "Other" || formData.reasonOfVisit === "Alumini") && (
            <div>
              <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
                {t("previsit.pleaseSpecify")} <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="otherReason"
                value={formData.otherReason}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300"
              />
              {submitAttempted && !formData.otherReason.trim() && (
                <p className="text-red-600 text-sm mt-1">{t("previsit.errors.specifyReason")}</p>
              )}
            </div>
          )}

          {/* Phone Number */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              {t("previsit.phoneNumber")} <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              placeholder={t("previsit.phoneNumberPlaceholder")}
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300"
            />
            {submitAttempted && !phoneValid && (
              <p className="text-red-600 text-sm mt-1">{t("previsit.errors.invalidPhone")}</p>
            )}
          </div>

          {/* Number of People */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              {t("previsit.numberOfPeople")} <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              placeholder={t("previsit.numberOfPeoplePlaceholder")}
              min="0"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleNumberOfPeopleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300"
            />
            {submitAttempted && formData.numberOfPeople === "" && (
  <p className="text-red-600 text-sm mt-1">{t("previsit.errors.numPeople")}</p>
)}
          </div>
          {/* Companion Details */}
          {formData.companions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">{t("previsit.companionDetails")}</h3>

              {formData.companions.map((companion, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-4">
                  
                  <input
                    type="text"
                    placeholder={t("previsit.companionName", { index: index + 1 })}
                    value={companion.name}
                    onChange={(e) =>
                      handleCompanionChange(index, "name", e.target.value)
                    }
                    className="px-4 py-3 rounded-xl border border-brown/50"
                  />

                  <input
                    type="tel"
                    placeholder={t("previsit.companionPhone", { index: index + 1 })}
                    value={companion.phone}
                    onChange={(e) =>
                      handleCompanionChange(index, "phone", e.target.value)
                    }
                    className="px-4 py-3 rounded-xl border border-brown/50"
                  />
                </div>
              ))}
            </div>
          )}
 
          {/* Submit Button */}
          <button
            type="submit"
            className="
              w-full py-3
              bg-[#8B5E3C]
              text-white
              font-bold
              rounded-full
              shadow-md
              hover:bg-[#4B2E1E]
              hover:scale-105
              transition-all duration-300
              tracking-wider
            "
          >
           {t("previsit.submit")}
          </button>
        </form>
        {showKeyboard && (
  <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 z-50">
    <Keyboard
      layoutName="default"
      layout={hindiLayout}
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