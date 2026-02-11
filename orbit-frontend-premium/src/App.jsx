import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Roadmap from "./pages/Roadmap";
import Jobs from "./pages/Jobs";
import ChatTutor from "./pages/ChatTutor";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/chat-tutor" element={<ChatTutor />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}