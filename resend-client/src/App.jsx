import React from "react";
import { Routes, Route } from "react-router-dom";
import VerifyAccount from "./pages/VerifyAccount";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ProtectedRoute from "./pages/ProtectedRoute";
import Navbar from "./components/Navbar";
import ApiKeys from "./pages/ApiKeys";
import Footer from "./components/Footer";
import { useThemeStyles } from "./utils/useThemeStyles";
import AppCredentials from "./pages/AppCredentials";
import QuickStart from "./pages/QuickStart";
import EmailTemplateBuilder from "./pages/EmailTemplateBuilder";
import EmailTemplate from "./pages/EmailTemplate";

const App = () => {
  const { background, foreground } = useThemeStyles();
  return (
    <div
      className="flex flex-col min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: background.color,
        color: foreground.color,
      }}
    >
      <Navbar />

      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:token" element={<VerifyAccount />} />
          <Route path="/quick-start" element={<QuickStart />} />
          <Route path="/email-template" element={<EmailTemplate />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/apikeys" element={<ApiKeys />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/app-credentials" element={<AppCredentials />} />
            <Route path="/create-template" element={<EmailTemplateBuilder />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
