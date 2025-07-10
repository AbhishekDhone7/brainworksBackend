import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Common Components
import HeaderDiv from "./components/Header";
import Navbar from "./components/Navbar";

// Auth Guards
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PrivateRoute from "./components/auth/PrivateRoute";

// Auth Pages
import LoginPage from "./pages/LoginPage/LoginPage";
import Register from "./pages/Register/Register";
import AdminLoginPage from "./pages/LoginPage/AdminLogin";
import AdminRegister from "./pages/Register/AdminRegister";

// Student Pages
import Dashboard from "./pages/UserPages/Dashboard";
import AddPayment from "./pages/UserPages/UploadPayment";
import PaymentSlips from "./pages/UserPages/PaymentSlips";
import ProfilePage from "./pages/UserPages/Profile";

// Admin Pages
import AdminPanel from "./pages/AdminPages/AdminPanel";
import ManageBatches from "./pages/AdminPages/ManageBatches";
import ManageStudents from "./pages/AdminPages/ManageStudents";
import VerifyPayments from "./pages/AdminPages/VerifyPayments";

// Other Pages
import Home from "./pages/OtherPages/Home";
import About from "./pages/OtherPages/About";
import Support from "./pages/OtherPages/Support";
import ErrorPage from "./pages/ErrorPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <HeaderDiv />
        {/* <Navbar /> if needed later */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin_login" element={<AdminLoginPage />} />
          <Route path="/admin_register" element={<AdminRegister />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />

          {/* Protected Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/upload-payment"
            element={
              <ProtectedRoute>
                <AddPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/payment-slip"
            element={
              <ProtectedRoute>
                <PaymentSlips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Private Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/manage-batches"
            element={
              <PrivateRoute>
                <ManageBatches />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/manage-students"
            element={
              <PrivateRoute>
                <ManageStudents />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <PrivateRoute>
                <VerifyPayments />
              </PrivateRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
