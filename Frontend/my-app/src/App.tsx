import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./app/page";
import LoginPage from "./app/login/page";
import RegisterPage from "./app/register/page";
import ForgotPasswordPage from "./app/forgot-password/page";
import ResetPasswordPage from "./app/reset-password/page";
import WorkspacePage from "./app/workspace/page";
import PdfReaderPage from "./app/pdf-reader/page";
import ProfilePage from "./app/profile/page";
import TechnologyPage from "./app/technology/page";
import InstallPage from "./app/install/page";
import DesignSystemPage from "./app/design-system/page";
import DevToolsProtection from "./components/security/DevToolsProtection";
import { LoadingProvider } from "./context/LoadingContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <div className="bg-black text-white antialiased custom-scrollbar min-h-screen">
      <DevToolsProtection />
      <Router>
        <LoadingProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/workspace" element={<WorkspacePage />} />
              <Route path="/pdf-reader" element={<PdfReaderPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/technology" element={<TechnologyPage />} />
              <Route path="/install" element={<InstallPage />} />
              <Route path="/design-system" element={<DesignSystemPage />} />
            </Routes>
          </AuthProvider>
        </LoadingProvider>
      </Router>
    </div>
  );
}
