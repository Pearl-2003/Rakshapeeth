import React, { useEffect, useRef, useState } from "react";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";
import axios from "axios";

const FLASK_API = "http://localhost:4000";

export default function AddStudent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    rollNo: "",
    course: "",
    studentPhone: "",
    personalEmail: "",
    collegeEmail: "",

    fatherName: "",
    fatherPhone: "",
    fatherEmail: "",

    motherName: "",
    motherPhone: "",
    motherEmail: "",

    houseNo: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [imageBlob, setImageBlob] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  /* ================= CAMERA EFFECT ================= */
  useEffect(() => {
    if (cameraOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraOn]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const stepFields = {
    1: [
      "firstName",
      "lastName",
      "rollNo",
      "course",
      "studentPhone",
      "personalEmail",
      "collegeEmail",
    ],
    2: [
      "fatherName",
      "fatherPhone",
      "fatherEmail",
      "motherName",
      "motherPhone",
      "motherEmail",
      "houseNo",
      "city",
      "state",
      "pincode",
    ],
  };

  const nextStep = () => {
    const fieldsToCheck = stepFields[step];
    for (const field of fieldsToCheck) {
      if (!form[field] || form[field].trim() === "") {
        Swal.fire("Error", "Please fill all fields before continuing", "error");
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  /* ================= FILE PICKER ================= */
  const handleFileSelect = (e) => {
    if (cameraOn) {
      Swal.fire("Warning", "Close camera before uploading file", "warning");
      return;
    }
    const file = e.target.files[0];
    if (file) {
      setImageBlob(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /* ================= CAMERA ================= */
  const openCamera = async () => {
    if (imageBlob) {
      Swal.fire("Warning", "Remove selected image first", "warning");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    setCameraOn(true);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      setImageBlob(blob);
      setImagePreview(URL.createObjectURL(blob));
      closeCamera();
    }, "image/jpeg", 0.95);
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCameraOn(false);
  };

  const removeImage = () => {
    setImageBlob(null);
    setImagePreview(null);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!imageBlob) {
      Swal.fire("Error", "Iris image is required", "error");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("image", imageBlob);

    try {
      const res = await axios.post(`${FLASK_API}/capture`, fd);
      Swal.fire(
        "Success 🎉",
        `Student Registered\nID: ${res.data.student_id}`,
        "success"
      );
    } catch (err) {
      const backendMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed";

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: backendMsg,
      });
    }
  };

  /* ================= UI ================= */
  return (
    <div className="bg-gradient-to-b from-cream to-cream/90 min-h-screen text-brown">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="pt-28 px-6 pb-20 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6">Add New Student</h1>

        <div className="bg-white p-6 rounded-2xl shadow-xl">

          {/* STEP INDICATOR */}
          <div className="flex justify-between mb-6 font-semibold">
            <span className={step === 1 ? "text-brown" : "text-gray-400"}>
              1. Student Details
            </span>
            <span className={step === 2 ? "text-brown" : "text-gray-400"}>
              2. Family & Address
            </span>
            <span className={step === 3 ? "text-brown" : "text-gray-400"}>
              3. Iris Registration
            </span>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-[#7B4B2A] text-cream px-4 py-2 rounded-lg font-semibold">
                Personal Details
              </div>

              {[
                ["firstName", "First Name"],
                ["lastName", "Last Name"],
                ["rollNo", "Roll No"],
                ["course", "Course"],
                ["studentPhone", "Student Phone"],
                ["personalEmail", "Personal Email"],
                ["collegeEmail", "College Email"],
              ].map(([k, l]) => (
                <input
                  key={k}
                  name={k}
                  placeholder={l}
                  value={form[k]}
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                />
              ))}

              <button onClick={nextStep} className="btn-primary">
                Next →
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-[#7B4B2A] text-cream px-4 py-2 rounded-lg font-semibold">
                Family & Address Details
              </div>

              {[
                ["fatherName", "Father Name"],
                ["fatherPhone", "Father Phone"],
                ["fatherEmail", "Father Email"],
                ["motherName", "Mother Name"],
                ["motherPhone", "Mother Phone"],
                ["motherEmail", "Mother Email"],
                ["houseNo", "House No"],
                ["city", "City"],
                ["state", "State"],
                ["pincode", "Pincode"],
              ].map(([k, l]) => (
                <input
                  key={k}
                  name={k}
                  placeholder={l}
                  value={form[k]}
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                />
              ))}

              <div className="flex justify-between">
                <button onClick={prevStep}>← Back</button>
                <button onClick={nextStep} className="btn-primary">
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-[#7B4B2A] text-cream px-4 py-2 rounded-lg font-semibold">
                Iris Registration
              </div>

              {!imagePreview && (
                <>
                  <input type="file" accept="image/*" onChange={handleFileSelect} />
                  <button onClick={openCamera} className="btn-primary ml-4">
                    Open Camera
                  </button>
                </>
              )}

              {cameraOn && (
                <>
                  <video ref={videoRef} autoPlay className="w-full rounded" />
                  <canvas ref={canvasRef} hidden />
                  <button onClick={captureImage} className="btn-primary">
                    Capture
                  </button>
                  <button onClick={closeCamera} className="ml-4 text-red-600">
                    Close Camera
                  </button>
                </>
              )}

              {imagePreview && (
                <>
                  <img src={imagePreview} alt="Preview" className="w-64 rounded" />
                  <button onClick={removeImage} className="text-red-600">
                    Remove / Retake
                  </button>
                </>
              )}

              <div className="flex justify-between">
                <button onClick={prevStep}>← Back</button>
                <button onClick={handleSubmit} className="btn-primary">
                  Register Student
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
