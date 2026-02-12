// AGSS-BV/myapp/src/pages/Guard/StuReg.jsx
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import HeaderNavbar from "../../components/HeaderNavbar3";
import Sidebar2 from "../../components/Sidebar2";
import Footer from "../../components/Footer";


export default function RegisterStudent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    personalEmail: "",
    collegeEmail: "",
    rollNo: "",
    course: "",

    studentPhone: "",
    fatherName: "",
    motherName: "",
    fatherEmail: "",
    motherEmail: "",
    fatherPhone: "",
    motherPhone: "",

    houseNo: "",
    street: "",
    pincode: "",
    city: "",
    state: "",
    country: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        fd.append(key, formData[key]);
      });
      
      const res = await axios.post(
  "http://localhost:4000/api/register-student",
  fd
);



      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        html: `<b>Student ID:</b> ${res.data.student_id}`,
        confirmButtonColor: "#7c4a2d"
      }).then((result) => {
  if (result.isConfirmed) {
    // store student_id safely
    localStorage.setItem("student_id", res.data.student_id);

    // navigate to Step 2
    navigate("/guard/face-consent");
  }
});

      // 👉 store student_id for next steps
      localStorage.setItem("student_id", res.data.student_id);

      // TODO: navigate to consent page
    }catch (err) {
  console.error("REGISTER ERROR:", err.response);

  Swal.fire({
    icon: "error",
    title: "Registration Failed",
    text:
      err.response?.data?.message ||
      err.response?.data?.error ||
      JSON.stringify(err.response?.data) ||
      "Unknown error",
    confirmButtonColor: "#7c4a2d",
  });
}

  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f1] to-[#f3eae3] flex flex-col">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1">
        <Sidebar2 sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-8 md:p-12 pb-32">

          <h1 className="text-3xl font-bold text-brown-800 mb-8">
            Student Registration
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-xl p-8 space-y-12"
          >
            {/* STUDENT INFO */}
            <section>
              <h2 className="text-xl font-semibold text-brown-700 mb-4">
                Student Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <input name="firstName" placeholder="First Name" className="input" onChange={handleChange} required />
                <input name="lastName" placeholder="Last Name" className="input" onChange={handleChange} required />
                <input name="personalEmail" placeholder="Personal Email" className="input" onChange={handleChange} />
                <input name="collegeEmail" placeholder="College Email" className="input" onChange={handleChange} />
                <input name="studentPhone" placeholder="Student Phone" className="input" onChange={handleChange} required />
                <input name="rollNo" placeholder="Roll Number" className="input" onChange={handleChange} />
                <input name="course" placeholder="Course" className="input md:col-span-2" onChange={handleChange} required />
              </div>
            </section>

            {/* PARENT DETAILS */}
            <section>
              <h2 className="text-xl font-semibold text-brown-700 mb-4">
                Parent Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <input name="fatherName" placeholder="Father's Name" className="input" onChange={handleChange} required />
                <input name="motherName" placeholder="Mother's Name" className="input" onChange={handleChange} required />
                <input name="fatherEmail" placeholder="Father's Email" className="input" onChange={handleChange} />
                <input name="motherEmail" placeholder="Mother's Email" className="input" onChange={handleChange} />
                <input name="fatherPhone" placeholder="Father's Phone" className="input" onChange={handleChange} required />
                <input name="motherPhone" placeholder="Mother's Phone" className="input" onChange={handleChange} required />
              </div>
            </section>

            {/* ADDRESS */}
            <section>
              <h2 className="text-xl font-semibold text-brown-700 mb-4">
                Address Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <input name="houseNo" placeholder="House No." className="input" onChange={handleChange} />
                <input name="street" placeholder="Street" className="input" onChange={handleChange} />
                <input name="pincode" placeholder="Pincode" className="input" onChange={handleChange} />
                <input name="city" placeholder="City" className="input" onChange={handleChange} />
                <input name="state" placeholder="State" className="input" onChange={handleChange} />
                <input name="country" placeholder="Country" className="input" onChange={handleChange} />
              </div>
            </section>

            {/* SUBMIT */}
            <section className="pt-6 border-t">
  <div className="flex justify-center">
    <button
  type="submit"
  className="px-12 py-3 bg-[#7c4a2d] text-white rounded-md hover:bg-[#5f3a22] transition font-semibold"
>
  Register Student
</button>

  </div>
</section>

          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
}
