import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SecureEntryPage from "./pages/SecureEntryPage";
import NotifyPage from "./pages/nm"; // Notification video page
import VehiclePage from "./pages/vm";
import AboutPage from "./pages/AboutPage";
import PrPage from "./pages/ParentReg";
import GrPage from "./pages/GuardReg";
import ParentVisitRequest from "./pages/Parent/parentVisit";
import Setting from "./pages/Setting";
import FeedbackPage from "./pages/feedback.js"; // Corrected
import LoginPage from "./pages/login";
import SettingPage from "./pages/settings";
import ContactUsPage from "./pages/ContactUs"; // Added
import CustomerCarePage from "./pages/CustomerCare";
import PreVisit from "./pages/PreVisit";
import AdminPage from "./pages/Admin/Dashboard";
import GuardDashboard from "./pages/Guard/Dashboard";
import ParentDashboard from "./pages/Parent/Dashboard";
import VerifyIris from "./pages/Guard/verifyIris";
import ApproveRequest from "./pages/Admin/Request";
import Whitelist from "./pages/Admin/Whitelist";
import Blacklist from "./pages/Admin/Blacklist";
import OccasionalVisitor from "./pages/Admin/OccasionalVisitor";
import StudentsPage from "./pages/Admin/Student";
import SystemActivity from "./pages/Admin/SystemActivity";
import MonitorGuard from "./pages/Admin/MonitorGuard";
import AddStudent from "./pages/Admin/AddStudent";
import AdminCreateGatepass from "./pages/Admin/GatePass";
import ViewHistory from "./pages/Parent/ViewHistory";
import ViewStudentLog from "./pages/Admin/ViewStudentLog";
import ManualEntryForm from "./pages/Guard/ManualEntry.js";
import AdminSetting from "./pages/Admin/AdminSettings";
import VerifyPassword from "./pages/Admin/VerifyPassword";
import EditAdminProfile from "./pages/Admin/EditAdminProfile";
import GuardSettings from "./pages/Guard/GuardSettings";
import VerifyGuardPassword from "./pages/Guard/VerifyGuardPassword";
import EditGuardProfile from "./pages/Guard/EditGuardProfile";
import ParentSettings from "./pages/Parent/ParentSettings";
import VerifyParentPassword from "./pages/Parent/VerifyParentPassword";
import EditParentProfile from "./pages/Parent/EditParentProfile";
import GuardVisitor from "./pages/Guard/Visitor";
import GuardsPage from "./pages/Admin/Guards";
import RegisterStudent from "./pages/Guard/StuReg.jsx";
import FaceConsent from "./pages/Guard/FaceConsent.jsx";
import FaceEnrollment from "./pages/Guard/FaceEnrollment.jsx";
import FaceTraining from "./pages/Guard/FaceTraining.jsx";
import FaceVerify from "./pages/Guard/FaceVerify.jsx";
import VehicleNumberPlate from "./pages/Guard/VehicleNumberPlate.jsx";
import VerifyTwoWheelerPlate from "./pages/Guard/VerifyBikePlate.jsx";
import ActiveGatePasses from "./pages/Admin/ActiveGatePass.js";
import VehicleLogsPage from "./pages/Admin/VehicleLogsPage.jsx";
import Alerts from "./pages/Admin/Alerts.jsx";  
import GuardAlertModal from "./components/GuardAlertModal.jsx";
import VehicleVerification from "./pages/Guard/VehicleVerification.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/secure-entry" element={<SecureEntryPage />} />
        <Route path="/notify" element={<NotifyPage />} />
        <Route path="/vehicle" element={<VehiclePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/parent-registration" element={<PrPage />} />
        <Route path="/guard-registration" element={<GrPage />} />
        <Route path="/parent-visit-request" element={<ParentVisitRequest />} />
        <Route path="/feedback" element={<FeedbackPage />} /> {/* Corrected */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} /> {/* Added */}
        <Route path="/customer-care" element={<CustomerCarePage />} />
        <Route path="/pre-visit" element={<PreVisit />} />
        <Route path="/admin/dashboard" element={<AdminPage />} />
        <Route path="/guard/dashboard" element={<GuardDashboard />} />
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/guard/verify-iris" element={<VerifyIris />} />
        <Route path="/admin/requests" element={<ApproveRequest />} />
        <Route path="/admin/whitelist" element={<Whitelist />} />
        <Route path="/admin/occasional-visitors" element={<OccasionalVisitor />} />
        <Route path="/admin/blacklist" element={<Blacklist />} />
        <Route path="/admin/guards" element={<GuardsPage />} />
        <Route path="/admin/students" element={<StudentsPage />} />
        <Route path="/admin/monitor-guard" element={<MonitorGuard />} />
        <Route path="/admin/add-student" element={<AddStudent />} />
        <Route path="/admin/create-gatepass" element={<AdminCreateGatepass />} />
        <Route path="/admin/system-activity" element={<SystemActivity />} />
          <Route path="/admin/view-student-log" element={<ViewStudentLog />} />
        <Route path="/guard/manual-entry" element={<ManualEntryForm />} />
        <Route path="/admin/settings" element={<AdminSetting />} />
        <Route path="/admin/verify-password" element={<VerifyPassword />} />
        <Route path="/admin/edit-profile" element={<EditAdminProfile />} />
        <Route path="/guard/settings" element={<GuardSettings />} />
        <Route path="/guard/verify-password" element={<VerifyGuardPassword />} />
        <Route path="/guard/edit-profile" element={<EditGuardProfile />} />
        <Route path="/parent/settings" element={<ParentSettings />} />
        <Route path="/parent/verify-password" element={<VerifyParentPassword />} />
        <Route path="/parent/edit-profile" element={<EditParentProfile />} />
        <Route path="/guard/visitors" element={<GuardVisitor />} />
        <Route path="/admin/active-gatepasses" element={<ActiveGatePasses />} />
        <Route path="/guard/register-student" element={<RegisterStudent />} />
        <Route path="/guard/face-consent" element={<FaceConsent />} />
        <Route path="/guard/face-enrollment" element={<FaceEnrollment />} />
        <Route path="/guard/face-training" element={<FaceTraining />} />
        <Route path="/guard/face-verify" element={<FaceVerify />} />
          <Route path="/guard/vehicle-verification" element={<VehicleVerification />} />
        <Route path="/guard/vehicle-number-plate" element={<VehicleNumberPlate />} />
        <Route path="/guard/verify-two-wheeler-plate" element={<VerifyTwoWheelerPlate />} />
        <Route path="/admin/vehicle-logs" element={<VehicleLogsPage />} />
        <Route path="/admin/alerts" element={<Alerts />} />
        <Route path="/parent/view-history" element={<ViewHistory />} />
        <Route path="/guard-alert-modal" element={<GuardAlertModal />} />
      </Routes>
    </Router>
  );
}

export default App;
