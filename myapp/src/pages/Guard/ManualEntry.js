import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import HeaderNavbar from "../../components/HeaderNavbar3";
import Sidebar2 from "../../components/Sidebar2";
import Footer from "../../components/Footer";

export default function ManualEntryForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    vehicleNo: "",
    idProof: "",
    idProofNumber: "",
    reasonOfVisit: "",
    otherReason: ""
  });

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

    if (!formData.name.trim())
      return Swal.fire("Missing Field", "Visitor name is required.", "error");

    if (!validatePhone(formData.phoneNo))
      return Swal.fire("Invalid Phone", "Enter a valid 10-digit phone number.", "error");

    if (!formData.idProof)
      return Swal.fire("Missing Field", "Please select an ID proof.", "error");

    if (!formData.idProofNumber.trim())
      return Swal.fire("Missing Field", "Please enter ID number.", "error");

    if (formData.idProof === "Aadhaar" && !validateAadhaar(formData.idProofNumber))
      return Swal.fire("Invalid Aadhaar", "Aadhaar must have 12 digits.", "error");

    if (formData.idProof === "PAN" && !validatePAN(formData.idProofNumber))
      return Swal.fire("Invalid PAN", "PAN format: ABCDE1234F.", "error");

    if (formData.idProof === "DL" && !validateDL(formData.idProofNumber))
      return Swal.fire("Invalid DL", "Invalid Driving License format.", "error");

    if (!formData.reasonOfVisit)
      return Swal.fire("Missing Field", "Please select a reason for visit.", "error");

    if (
      (formData.reasonOfVisit === "Other" ||
        formData.reasonOfVisit === "Alumni") &&
      !formData.otherReason.trim()
    )
      return Swal.fire("Missing Field", "Please specify the reason.", "error");

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

await axios.post(
  "http://localhost:5000/api/manual-entry",
  payload,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);


      Swal.fire({
        icon: "success",
        title: "Entry Recorded",
        text: "Manual visitor entry saved successfully.",
        timer: 2000,
        showConfirmButton: false
      });

      setFormData({
        name: "",
        phoneNo: "",
        vehicleNo: "",
        idProof: "",
        idProofNumber: "",
        reasonOfVisit: "",
        otherReason: ""
      });

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save manual entry.", "error");
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
                Manual Visitor Entry
              </h2>
              <p className="text-gray-600 text-lg">
                Guard-assisted entry for vehicles & walking visitors
              </p>
              <div className="h-1 w-28 mx-auto bg-[#8B5E3C]/50 rounded-full" />
            </div>

            {/* VISITOR DETAILS */}
            <section className="bg-[#faf7f4] p-8 rounded-2xl border space-y-6">
              <h3 className="text-xl font-bold text-[#5C3A21]">👤 Visitor Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="name"
                  placeholder="Visitor Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-modern"
                />
                <input
                  name="phoneNo"
                  placeholder="Phone Number *"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  className="input-modern"
                />
              </div>
            </section>

            {/* VEHICLE */}
            <section className="bg-[#faf7f4] p-8 rounded-2xl border space-y-4">
              <h3 className="text-xl font-bold text-[#5C3A21]">🚗 Vehicle (Optional)</h3>

              <input
                name="vehicleNo"
                placeholder="Vehicle Number (leave empty for walking visitors)"
                value={formData.vehicleNo}
                onChange={handleChange}
                className="input-modern"
              />
            </section>

            {/* ID VERIFICATION */}
            <section className="bg-[#faf7f4] p-8 rounded-2xl border space-y-6">
              <h3 className="text-xl font-bold text-[#5C3A21]">🪪 Identity Verification</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select
                  name="idProof"
                  value={formData.idProof}
                  onChange={handleChange}
                  className="input-modern"
                >
                  <option value="">Select ID Proof *</option>
                  <option value="Aadhaar">Aadhaar</option>
                  <option value="PAN">PAN</option>
                  <option value="DL">Driving License</option>
                </select>

                <input
                  name="idProofNumber"
                  placeholder="ID Number *"
                  value={formData.idProofNumber}
                  onChange={handleChange}
                  className="input-modern"
                />
              </div>
            </section>

            {/* VISIT REASON */}
            <section className="bg-[#faf7f4] p-8 rounded-2xl border space-y-6">
              <h3 className="text-xl font-bold text-[#5C3A21]">📋 Visit Information</h3>

              <select
                name="reasonOfVisit"
                value={formData.reasonOfVisit}
                onChange={handleChange}
                className="input-modern"
              >
                <option value="">Select Reason *</option>
                <option value="Delivery">Delivery</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Official Work">Official Work</option>
                <option value="Parent / Guardian">Parent / Guardian</option>
                <option value="Alumni">Alumni</option>
                <option value="Other">Other</option>
              </select>

              {(formData.reasonOfVisit === "Other" ||
                formData.reasonOfVisit === "Alumni") && (
                <input
                  name="otherReason"
                  placeholder="Please specify reason *"
                  value={formData.otherReason}
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
              Save Manual Entry
            </button>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
}
