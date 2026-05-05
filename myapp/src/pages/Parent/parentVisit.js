import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import HeaderNavbar from "../../components/HeaderNavbar4";
import Sidebar from "../../components/Sidebar3";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
export default function ParentVisitRequest() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
   const [loading, setLoading] = useState(false);
  const registerRef = useRef(null);
  const moreRef = useRef(null);
  const validatePhone = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10;
};
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
  vehicleType: "",
  vehicleNo: "",
  noOfCompanions: "",
  companions: [],

  // ⭐ NEW
  driverName: "",
  driverPhone: "",
  driverVehicleNumber: ""
});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCompanionCountChange = (e) => {
  const count = Number(e.target.value);
  let companions = [...formData.companions];

  if (count > companions.length) {
    for (let i = companions.length; i < count; i++) {
      companions.push({ name: "" });
    }
  } else {
    companions = companions.slice(0, count);
  }

  setFormData({
    ...formData,
    noOfCompanions: count,
    companions
  });
};

const handleCompanionChange = (index, field, value) => {
  const updated = [...formData.companions];
  updated[index][field] = value;

  setFormData({
    ...formData,
    companions: updated
  });
};
  const handleSubmit = async (e) => {
  e.preventDefault();

  const { dateOfVisit, noOfCompanions, vehicleType, vehicleNo, companions } = formData;
  const errors = [];

  // 1️⃣ Required fields
  // ⭐ Public transport validation
if (vehicleType === "Public") {
  if (!formData.driverName.trim()) {
    errors.push(t("driverNameRequired"));
  }

  if (!validatePhone(formData.driverPhone)) {
    errors.push(t("driverPhoneInvalid"));
  }

  if (!formData.driverVehicleNumber.trim()) {
    errors.push(t("driverVehicleRequired"));
  }
}
  if (!dateOfVisit) errors.push(t("fillDateOfVisit"));
  if (noOfCompanions === "") errors.push(t("fillNoOfCompanions"));

  // 2️⃣ Vehicle number required if Private
  if (vehicleType === "Private" && (!vehicleNo || vehicleNo.trim() === "")) {
    errors.push(t("fillVehicleNo"));
  }

  // 3️⃣ Companion validations
  if (Number(noOfCompanions) > 0) {
    (companions || []).forEach((c, i) => {
      if (!c.name.trim()) errors.push(`${t("companionName")} ${i + 1} ${t("required")}`);
      if (!validatePhone(c.phone || "")) errors.push(`${t("companionPhone")} ${i + 1} ${t("invalidPhone")}`);
    });
  }

  // Show errors if any
  if (errors.length > 0) {
    Swal.fire({
      icon: "error",
      title: t("formErrors"),
      html: errors.map((err) => `<p>${err}</p>`).join(""),
      confirmButtonColor: "#6b4226",
    });
    return;
  }

  // ✅ Proceed with submission
  const token = localStorage.getItem("parentToken");

  if (!token) {
    Swal.fire({
      icon: "error",
      title: t("unauthorized"),
      text: t("loginAgain"),
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
        body: JSON.stringify({
          ...formData,
          vehicleNo: formData.vehicleNo?.toUpperCase()
        })
      }
    );

    const data = await res.json();

    if (res.status === 409) {
      Swal.fire({
        icon: "info",
        title: t("requestAlreadyMade"),
        text: data.message || t("alreadyRequested"),
        confirmButtonColor: "#6b4226"
      });
      return;
    }

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: t("requestFailed"),
        text: data.message || t("somethingWentWrong"),
        confirmButtonColor: "#6b4226"
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: t("visitConfirmed"),
      text: t("visitSubmittedSuccess"),
      confirmButtonColor: "#6b4226"
    });

    // Reset form
    setFormData({
      dateOfVisit: "",
      vehicleType: "",
      vehicleNo: "",
      noOfCompanions: "",
      companions: []
    });

  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: t("serverError"),
      text: t("unableToConnect"),
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
             {t("visitRequest")}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brown to-brown/60 mx-auto my-4 rounded-full"></div>
            <p className="text-brown/70 text-lg max-w-md mx-auto">
              {t("visitSubtitle")}
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-brown/80">
                {t("dateOfVisit")}
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

            {/* Vehicle Type */}
<div>
  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-brown/80">
    {t("vehicleType")}
  </label>

  <select
    name="vehicleType"
    value={formData.vehicleType}
    onChange={handleChange}
    className="w-full px-5 py-4 rounded-2xl bg-white/90 focus:outline-none focus:ring-4 focus:ring-brown/30 shadow-inner text-brown"
  >
    <option value="">{t("selectVehicleType")}</option>
    <option value="Private">{t("privateVehicle")}</option>
    <option value="Public">{t("publicTransport")}</option>
    <option value="None">{t("withoutVehicle")}</option>
  </select>
</div>

{/* Vehicle Number */}
{formData.vehicleType === "Private" && (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-brown/80">
      {t("vehicleNumber")}
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
)}
{/* ⭐ Driver Details (ONLY for Public Transport) */}
{formData.vehicleType === "Public" && (
  <div className="space-y-4">

    <input
      type="text"
      name="driverName"
      placeholder={t("driverName")}
      value={formData.driverName}
      onChange={handleChange}
      className="w-full px-5 py-4 rounded-2xl bg-white/90 shadow-inner"
    />

    <input
      type="tel"
      name="driverPhone"
      placeholder={t("driverPhone")}
      value={formData.driverPhone}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d{0,10}$/.test(value)) {
          handleChange(e);
        }
      }}
      maxLength="10"
      className="w-full px-5 py-4 rounded-2xl bg-white/90 shadow-inner"
    />

    <input
      type="text"
      name="driverVehicleNumber"
      placeholder={t("driverVehicleNumber")}
      value={formData.driverVehicleNumber}
      onChange={handleChange}
      className="w-full px-5 py-4 rounded-2xl bg-white/90 shadow-inner uppercase"
    />
  </div>
)}

            {/* Number of Companions */}
<div>
  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-brown/80">
    {t("numberOfCompanions")}
  </label>

  <input
    type="number"
    name="noOfCompanions"
    value={formData.noOfCompanions}
    onChange={handleCompanionCountChange}
    min="0"
    className="w-full px-5 py-4 rounded-2xl bg-white/90 focus:outline-none focus:ring-4 focus:ring-brown/30 shadow-inner text-brown"
  />
</div>

{/* Companion Details */}
{formData.companions.map((companion, index) => (
  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Companion Name */}
    <input
      type="text"
      placeholder={`${t("companionName")} ${index + 1}`}
      value={companion.name}
      onChange={(e) =>
        handleCompanionChange(index, "name", e.target.value)
      }
      className="px-5 py-4 rounded-2xl bg-white/90 focus:outline-none focus:ring-4 focus:ring-brown/30 shadow-inner"
    />

    {/* Companion Phone */}
    <input
  type="tel"
  placeholder={`${t("companionPhone")} ${index + 1}`}
  value={companion.phone || ""}
  onChange={(e) => {
    const value = e.target.value;

    if (/^\d{0,10}$/.test(value)) {
      handleCompanionChange(index, "phone", value);
    }
  }}
  maxLength="10"
  className="px-5 py-4 rounded-2xl bg-white/90 focus:outline-none focus:ring-4 focus:ring-brown/30 shadow-inner"
/>

  </div>
))}
            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full mt-10 py-4 rounded-2xl bg-gradient-to-r from-brown to-[#5a351d] text-cream text-lg font-bold tracking-wide shadow-[0_15px_40px_rgba(91,53,29,0.5)] hover:shadow-[0_20px_50px_rgba(91,53,29,0.6)] hover:scale-[1.03] transition-all duration-300"
            >
              {t("submitVisitRequest")}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
