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

import ProtectedRoute from "./components/ProtectedRoute";

import ContactUsPage from "./pages/ContactUs"; // Added
import ContactUsPageAdmin from "./pages/ContactUsAdmin"; // Added
import ContactUsPageGuard from "./pages/ContactUsGuard"; // Added
import ContactUsPageParent from "./pages/ContactUsParent"; // Added

import CustomerCarePage from "./pages/CustomerCare";
import CustomerCareAdmin from "./pages/CustomerCareAdmin";
import CustomerCareGuard from "./pages/CustomerCareGuard";
import CustomerCareParent from "./pages/CustomerCareParent";

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

        <Route path="/customer-care-admin" 
        element={
          <ProtectedRoute role="admin">
            <CustomerCareAdmin />
          </ProtectedRoute>
        } /> {/* Added */}
        <Route path="/customer-care-guard" 
        element={
        <ProtectedRoute role="guard">
            <CustomerCareGuard />
          </ProtectedRoute>
        } /> {/* Added */}
        <Route path="/customer-care-parent" element={
          <ProtectedRoute role="parent">
            <CustomerCareParent />
          </ProtectedRoute>
        } /> {/* Added */}

        <Route path="/ContactUs-admin" 
        element={
        <ProtectedRoute role="admin">
              <ContactUsPageAdmin />
            </ProtectedRoute>
        } /> 
        <Route path="/ContactUs-guard" element={
          <ProtectedRoute role="guard">
            <ContactUsPageGuard />
          </ProtectedRoute>
        } /> {/* Added */}
        <Route path="/ContactUs-parent" element={
          <ProtectedRoute role="parent">
            <ContactUsPageParent />
          </ProtectedRoute>
        } /> {/* Added */}

        <Route path="/pre-visit" element={<PreVisit />} />

        {/* <Route path="/admin/dashboard" element={<AdminPage />} /> */}
        {/* <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        /> */}

        <Route path="/guard/dashboard" element={
          <ProtectedRoute role="guard">
            <GuardDashboard />
          </ProtectedRoute>
        } />
        <Route path="/parent/dashboard" element={
          <ProtectedRoute role="parent">
            <ParentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/guard/verify-iris" element={
          <ProtectedRoute role="guard">
            <VerifyIris />
          </ProtectedRoute>
        } />

        {/* <Route path="/admin/requests" element={<ApproveRequest />} /> */}
        <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute role="admin">
                <ApproveRequest />
              </ProtectedRoute>
            }
          />
        <Route 
          path="/admin/whitelist" 
          element={
          <ProtectedRoute role="admin">
                <Whitelist />
              </ProtectedRoute>
          }   
        />
        <Route 
          path="/admin/occasional-visitors" 
          element={
          <ProtectedRoute role="admin">
                <OccasionalVisitor />
              </ProtectedRoute>
          }   
        />
        <Route 
          path="/admin/blacklist" 
          element={
          <ProtectedRoute role="admin">
                <Blacklist />
              </ProtectedRoute>
          }   
        />
        <Route 
          path="/admin/guards" 
          element={
          <ProtectedRoute role="admin">
                <GuardsPage />
              </ProtectedRoute>
          }   
        />
        <Route 
          path="/admin/students" 
          element={
          <ProtectedRoute role="admin">
                <StudentsPage />
              </ProtectedRoute>
          }   
        />
        <Route 
          path="/admin/monitor-guard" 
          element={
          <ProtectedRoute role="admin">
                <MonitorGuard />
              </ProtectedRoute>
          }   
        />
        <Route 
          path="/admin/add-student" 
          element={
          <ProtectedRoute role="admin">
                <AddStudent />
              </ProtectedRoute>
          }   
        />
        <Route 
          path="/admin/create-gatepass" 
          element={
          <ProtectedRoute role="admin">
                <AdminCreateGatepass />
              </ProtectedRoute>
          }   
        />
        <Route 
          path="/admin/system-activity" 
          element={
          <ProtectedRoute role="admin">
                <SystemActivity />
              </ProtectedRoute>
          }   
          />
          <Route path="/admin/view-student-log" 
          element={
          <ProtectedRoute role="admin">
                <ViewStudentLog />
              </ProtectedRoute>
          }   
        />


        <Route path="/guard/manual-entry" element={
          <ProtectedRoute role="guard">
            <ManualEntryForm />
          </ProtectedRoute>
        } />



        <Route path="/admin/settings" 
        element={
        <ProtectedRoute role="admin">
              <AdminSetting />
            </ProtectedRoute>
        } />
        <Route path="/admin/verify-password" 
        element={
        <ProtectedRoute role="admin">
              <VerifyPassword />
            </ProtectedRoute>
        } />
        <Route path="/admin/edit-profile" 
        element={
        <ProtectedRoute role="admin">
              <EditAdminProfile />
            </ProtectedRoute>
        } />


        <Route path="/guard/settings" element={
          <ProtectedRoute role="guard">
            <GuardSettings />
          </ProtectedRoute>
        } />
        <Route path="/guard/verify-password" element={
          <ProtectedRoute role="guard">
            <VerifyGuardPassword />
          </ProtectedRoute>
        } />
        <Route path="/guard/edit-profile" element={
          <ProtectedRoute role="guard">
            <EditGuardProfile />
          </ProtectedRoute>
        } />


        <Route path="/parent/settings" element={
          <ProtectedRoute role="parent">
            <ParentSettings />
          </ProtectedRoute>
        } />
        <Route path="/parent/verify-password" element={
          <ProtectedRoute role="parent">
            <VerifyParentPassword />
          </ProtectedRoute>
        } />
        <Route path="/parent/edit-profile" element={
          <ProtectedRoute role="parent">
            <EditParentProfile />
          </ProtectedRoute>
        } />


        <Route path="/guard/visitors" element={
          <ProtectedRoute role="guard">
            <GuardVisitor />
          </ProtectedRoute>
        } />


        <Route path="/admin/active-gatepasses" 
        element={
        <ProtectedRoute role="admin">
              <ActiveGatePasses />
            </ProtectedRoute>
        } />



        <Route path="/guard/register-student" element={
          <ProtectedRoute role="guard">
            <RegisterStudent />
          </ProtectedRoute>
        } />
        <Route path="/guard/face-consent" element={
          <ProtectedRoute role="guard">
            <FaceConsent />
          </ProtectedRoute>
        } />
        <Route path="/guard/face-enrollment" element={
          <ProtectedRoute role="guard">
            <FaceEnrollment />
          </ProtectedRoute>
        } />
        <Route path="/guard/face-training" element={
          <ProtectedRoute role="guard">
            <FaceTraining />
          </ProtectedRoute>
        } />
        <Route path="/guard/face-verify" element={
          <ProtectedRoute role="guard">
            <FaceVerify />
          </ProtectedRoute>
        } />
          <Route path="/guard/vehicle-verification" element={
            <ProtectedRoute role="guard">
              <VehicleVerification />
            </ProtectedRoute>
          } />
        <Route path="/guard/vehicle-number-plate" element={
          <ProtectedRoute role="guard">
            <VehicleNumberPlate />
          </ProtectedRoute>
        } />
        <Route path="/guard/verify-two-wheeler-plate" element={
          <ProtectedRoute role="guard">
            <VerifyTwoWheelerPlate />
          </ProtectedRoute>
        } />


        <Route path="/admin/vehicle-logs" 
        element={
        <ProtectedRoute role="admin">
              <VehicleLogsPage />
            </ProtectedRoute>
        } />
        <Route path="/admin/alerts" 
        element={
        <ProtectedRoute role="admin">
              <Alerts />
            </ProtectedRoute>
        } />


        <Route path="/parent/view-history" element={
          <ProtectedRoute role="parent">
            <ViewHistory />
          </ProtectedRoute>
        } />
        <Route path="/guard-alert-modal" element={
          <ProtectedRoute role="guard">
            <GuardAlertModal />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;